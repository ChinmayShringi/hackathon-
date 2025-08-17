import https from "https";
import { Readable } from "stream";

export function getHeadMetadata(url: string): Promise<{ contentLength: number | null; contentType: string | null }> {
  return new Promise((resolve) => {
    https.get(url, { method: "HEAD" }, (res) => {
      const len = res.headers["content-length"];
      const type = res.headers["content-type"];
      resolve({
        contentLength: len ? parseInt(len, 10) : null,
        contentType: type || null,
      });
    }).on("error", () => resolve({ contentLength: null, contentType: null }));
  });
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

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function streamToBufferParts(stream: Readable, partSize: number): Promise<Buffer[]> {
  const parts: Buffer[] = [];
  let current = Buffer.alloc(0);

  for await (const chunk of stream) {
    current = Buffer.concat([current, chunk]);
    while (current.length >= partSize) {
      parts.push(current.slice(0, partSize));
      current = current.slice(partSize);
    }
  }

  if (current.length > 0) {
    parts.push(current);
  }

  return parts;
} 