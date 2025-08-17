import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import './env.js';

let s3: S3Client | null = null;
function getS3(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3;
}

export async function getObjectBuffer(bucket: string, key: string): Promise<Buffer> {
  const res = await getS3().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const stream = res.Body as any;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function putObjectBuffer(bucket: string, key: string, body: Buffer, contentType: string): Promise<void> {
  await getS3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}

export async function headObject(bucket: string, key: string): Promise<{ contentLength: number | null; contentType: string | null; exists: boolean }> {
  try {
    const res = await getS3().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return {
      contentLength: typeof res.ContentLength === 'number' ? res.ContentLength : (res.ContentLength ? Number(res.ContentLength) : null),
      contentType: res.ContentType || null,
      exists: true,
    };
  } catch (e: any) {
    if (e?.$metadata?.httpStatusCode === 404) {
      return { contentLength: null, contentType: null, exists: false };
    }
    throw e;
  }
}

export async function getObjectRange(bucket: string, key: string, start: number, endInclusive: number): Promise<Buffer> {
  const res = await getS3().send(new GetObjectCommand({ Bucket: bucket, Key: key, Range: `bytes=${start}-${endInclusive}` }));
  const stream = res.Body as any;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
