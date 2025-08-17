import './env.js';
import { getObjectBuffer, putObjectBuffer } from './s3-utils';

let sharp: any = null;
try {
  // Lazy require sharp; if unavailable, we'll skip derivative generation
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sharp = require('sharp');
} catch (_) {
  sharp = null;
}

const BUCKET = 'delula-media-prod';
const CDN = 'https://cdn.delu.la';

export class DerivativeService {
  async generateImageDerivatives(originalKey: string, uuid: string): Promise<{ thumbnailUrl?: string; previewUrl?: string; webpUrl?: string }> {
    if (!sharp) {
      // No-op if sharp isn't available
      return {};
    }
    const buf = await getObjectBuffer(BUCKET, originalKey);

    // Thumbnail 300x300
    const thumbBuf = await sharp(buf).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
    const thumbKey = originalKey.replace('/originals/', '/thumbnails/').replace(/\.[A-Za-z0-9]+$/, '.jpg');
    await putObjectBuffer(BUCKET, thumbKey, thumbBuf, 'image/jpeg');

    // Preview 800x800 max
    const previewBuf = await sharp(buf).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
    const previewKey = originalKey.replace('/originals/', '/previews/').replace(/\.[A-Za-z0-9]+$/, '.jpg');
    await putObjectBuffer(BUCKET, previewKey, previewBuf, 'image/jpeg');

    // WebP
    const webpBuf = await sharp(buf).resize(1600, 1600, { fit: 'inside' }).webp({ quality: 82 }).toBuffer();
    const webpKey = originalKey.replace('/originals/', '/webp/').replace(/\.[A-Za-z0-9]+$/, '.webp');
    await putObjectBuffer(BUCKET, webpKey, webpBuf, 'image/webp');

    return {
      thumbnailUrl: `${CDN}/${thumbKey}`,
      previewUrl: `${CDN}/${previewKey}`,
      webpUrl: `${CDN}/${webpKey}`,
    };
  }

  async generateVideoDerivatives(_originalKey: string, _uuid: string): Promise<{ thumbnailUrl?: string }> {
    // TODO: integrate Lambda-based thumbnail if needed (VideoToGIF_Square or GetFrames)
    return {};
  }
}

export const derivativeService = new DerivativeService();
