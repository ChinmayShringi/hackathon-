import https from "https";
import { Readable } from "stream";
import fs from "fs";
import { promisify } from "util";
import { execFile } from "child_process";
import type { 
	VideoMetadata, 
	FrameExtractionResult, 
	FrameRequest, 
	FrameSpec 
} from "./types";
import { URL } from 'url';

// Get ffmpeg and ffprobe paths from Lambda layer (same pattern as VideoToGIF_Square)
let ffmpegPath: string;
let ffprobePath: string;

try {
	// Check if public layer binaries exist
	if (fs.existsSync('/opt/bin/ffmpeg') && fs.existsSync('/opt/bin/ffprobe')) {
		ffmpegPath = '/opt/bin/ffmpeg';
		ffprobePath = '/opt/bin/ffprobe';
	} else {
		// Fallback to local binaries for development
		ffmpegPath = '/usr/bin/ffmpeg';
		ffprobePath = '/usr/bin/ffprobe';
	}
} catch (error) {
	// Fallback to local binaries for development
	ffmpegPath = '/usr/bin/ffmpeg';
	ffprobePath = '/usr/bin/ffprobe';
}

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);
const execFileAsync = promisify(execFile);

// Supported video formats
const SUPPORTED_FORMATS = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.flv', '.wmv'];

export function validateVideoUrl(url: string): boolean {
	const urlLower = url.toLowerCase();
	return SUPPORTED_FORMATS.some(format => urlLower.includes(format)) || 
			urlLower.includes('video/');
}

export function getStreamFromUrl(url: string): Promise<Readable> {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			if (res.statusCode !== 200) {
				return reject(new Error(`Bad status: ${res.statusCode}`));
			}
			resolve(res);
		}).on("error", reject);
	});
}

export async function downloadVideoToTemp(url: string): Promise<string> {
	const stream = await getStreamFromUrl(url);
	const tempFile = `/tmp/video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp4`;
	
	const chunks: Buffer[] = [];
	for await (const chunk of stream) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}
	
	const buffer = Buffer.concat(chunks);
	await writeFile(tempFile, buffer);
	
	return tempFile;
}

export async function getVideoMetadata(inputPath: string): Promise<VideoMetadata> {
	try {
		const { stdout } = await execFileAsync(ffprobePath, [
			'-v', 'quiet',
			'-print_format', 'json',
			'-show_format',
			'-show_streams',
			inputPath
		]);
		const metadata = JSON.parse(stdout);
		
		const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
		if (!videoStream) {
			throw new Error('No video stream found');
		}
		
		// Get file size
		const fileStats = await stat(inputPath);
		
		return {
			// Keep width/height at top-level for backward-compat with current handler
			// (the handler wraps these into the response as-is)
			width: videoStream.width || 0,
			height: videoStream.height || 0,
			duration: metadata.format.duration || 0,
			format: metadata.format.format_name || 'unknown',
			file_size: fileStats.size
		} as unknown as VideoMetadata;
	} catch (error) {
		throw new Error(`Failed to get video metadata: ${error}`);
	}
}

export async function getTotalFrames(inputPath: string): Promise<number> {
	try {
		// Try quick path: nb_frames
		const { stdout } = await execFileAsync(ffprobePath, [
			'-v', 'error',
			'-select_streams', 'v:0',
			'-show_entries', 'stream=nb_frames',
			'-of', 'json',
			inputPath
		]);
		const metadata = JSON.parse(stdout);
		
		const streams = metadata.streams || [];
		if (streams.length > 0 && streams[0].nb_frames && streams[0].nb_frames !== "N/A") {
			return parseInt(streams[0].nb_frames);
		}

		// Fallback: count frames by decoding (slower but reliable)
		const { stdout: stdout2 } = await execFileAsync(ffprobePath, [
			'-v', 'error',
			'-select_streams', 'v:0',
			'-count_frames',
			'-show_entries', 'stream=nb_read_frames',
			'-of', 'json',
			inputPath
		]);
		const metadata2 = JSON.parse(stdout2);
		
		const streams2 = metadata2.streams || [];
		if (streams2.length > 0 && streams2[0].nb_read_frames) {
			return parseInt(streams2[0].nb_read_frames);
		}

		throw new Error("Could not determine total frame count");
	} catch (error) {
		throw new Error(`Failed to get total frames: ${error}`);
	}
}

export function parseFrameRequests(frameRequests: string): FrameRequest {
	const original = frameRequests.trim();
	const parts = original.split(',').map(part => part.trim());
	
	const parsed: FrameSpec[] = [];
	
	for (const part of parts) {
		if (part.includes('%')) {
			// Percentage-based frame
			const percentage = parseFloat(part.replace('%', ''));
			if (isNaN(percentage) || percentage < 0 || percentage > 100) {
				throw new Error(`Invalid percentage: ${part}`);
			}
			parsed.push({
				type: 'percentage',
				value: percentage,
				original: part
			});
		} else if (part.startsWith('-')) {
			// Negative index
			const value = parseInt(part);
			if (isNaN(value)) {
				throw new Error(`Invalid negative index: ${part}`);
			}
			parsed.push({
				type: 'negative',
				value: value,
				original: part
			});
		} else {
			// Positive index
			const value = parseInt(part);
			if (isNaN(value) || value < 0) {
				throw new Error(`Invalid frame index: ${part}`);
			}
			parsed.push({
				type: 'index',
				value: value,
				original: part
			});
		}
	}
	
	return {
		original,
		parsed
	};
}

export function resolveFrameIndex(frameSpec: FrameSpec, totalFrames: number): number {
	switch (frameSpec.type) {
		case 'index':
			return Math.max(0, Math.min(frameSpec.value, totalFrames - 1));
		case 'percentage':
			return Math.floor((frameSpec.value / 100) * totalFrames);
		case 'negative':
			const resolved = totalFrames + frameSpec.value;
			if (resolved < 0) {
				throw new Error(`Negative index ${frameSpec.original} exceeds video length (${totalFrames} frames)`);
			}
			return resolved;
		default:
			throw new Error(`Unknown frame type: ${frameSpec.type}`);
	}
}

export async function extractFrameByIndex(
	inputPath: string, 
	frameIndex: number, 
	outputPath: string
): Promise<FrameExtractionResult> {
	const startTime = Date.now();
	
	try {
		// Use frame-accurate extraction with select filter; execFile avoids shell quoting issues
		const vfArg = `select=eq(n\\,${frameIndex})`;
		const args = [
			'-hide_banner',
			'-loglevel', 'error',
			'-i', inputPath,
			'-vf', vfArg,
			'-vsync', '0',
			'-frames:v', '1',
			'-y',
			outputPath
		];
		console.log(`Extracting frame ${frameIndex}: ${ffmpegPath} ${args.join(' ')}`);
		await execFileAsync(ffmpegPath, args);
		
		const processingTime = Date.now() - startTime;
		
		return {
			success: true,
			frame_id: frameIndex,
			output_path: outputPath,
			processing_time_ms: processingTime
		};
	} catch (error) {
		const processingTime = Date.now() - startTime;
		
		return {
			success: false,
			frame_id: frameIndex,
			output_path: outputPath,
			processing_time_ms: processingTime,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}

export async function cleanupTempFiles(files: string[]): Promise<void> {
	for (const file of files) {
		try {
			await unlink(file);
			console.log(`Cleaned up: ${file}`);
		} catch (error) {
			console.log(`Warning: Could not clean up ${file}: ${error}`);
		}
	}
}

export async function notifyServerThumbnailReady(serverBaseUrl: string, secret: string, userId: string, assetId: string, thumbnailUrl: string): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const url = new URL('/api/media-library/webhook/thumbnail-ready', serverBaseUrl);
			const payload = JSON.stringify({ userId, assetId, thumbnailUrl });
			const opts: https.RequestOptions = {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'content-length': Buffer.byteLength(payload),
					'x-webhook-secret': secret,
				},
			};
			const req = https.request(url, opts, (res) => {
				// Drain response and resolve on 2xx
				if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
					return reject(new Error(`Webhook status ${res.statusCode}`));
				}
				res.on('data', () => {});
				res.on('end', () => resolve());
			});
			req.on('error', reject);
			req.write(payload);
			req.end();
		} catch (e) {
			reject(e);
		}
	});
}
