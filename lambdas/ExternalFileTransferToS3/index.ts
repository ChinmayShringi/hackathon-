import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { ExternalFileTransferRequest } from "./types.js";
import { getHeadMetadata, getStreamFromUrl, streamToBuffer } from "./stream-utils.js";

const s3 = new S3Client({});

const MAX_PART_SIZE = 5 * 1024 * 1024; // 5 MB

export const handler = async (event: ExternalFileTransferRequest) => {
  const { remote_url, bucket, key, mime_type } = event;

  if (!remote_url || !bucket || !key) {
    return { statusCode: 400, body: "Missing required fields." };
  }

  try {
    const { contentLength, contentType: detectedType } = await getHeadMetadata(remote_url);
    const contentType = mime_type || detectedType || "application/octet-stream";
    const isValidLength = typeof contentLength === 'number' && contentLength > 0;
    const useMultipart = isValidLength && contentLength > MAX_PART_SIZE;

    if (!useMultipart) {
      // For small files, use simple PUT
      const stream = await getStreamFromUrl(remote_url);
      const body = await streamToBuffer(stream);
      
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: body.length
      }));
      
      let warning = '';
      if (!isValidLength) {
        warning = ' (Warning: content length missing, used single PUT even if file may be large)';
      } else if (contentLength > MAX_PART_SIZE) {
        warning = ' (Warning: large file uploaded with single PUT due to missing content length)';
      }
      return { statusCode: 200, body: `Uploaded using single PUT${warning}` };
    }

    // For large files, use Upload class which handles multipart automatically
    const stream = await getStreamFromUrl(remote_url);
    
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
      queueSize: 4, // number of concurrent uploads
      partSize: MAX_PART_SIZE,
      leavePartsOnError: false,
    });

    await upload.done();
    return { statusCode: 200, body: "Uploaded using multipart" };

  } catch (err: any) {
    console.error("Upload failed", err);
    return { statusCode: 500, body: `Upload error: ${err.message}` };
  }
}; 