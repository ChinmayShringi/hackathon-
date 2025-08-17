"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var MakeThumbnailsFromImage_exports = {};
__export(MakeThumbnailsFromImage_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(MakeThumbnailsFromImage_exports);
var import_aws_sdk = __toESM(require("aws-sdk"));
var import_fs2 = __toESM(require("fs"));
var import_util2 = require("util");

// image-utils.ts
var import_fs = __toESM(require("fs"));
var import_child_process = require("child_process");
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var writeFile = (0, import_util.promisify)(import_fs.default.writeFile);
var unlink = (0, import_util.promisify)(import_fs.default.unlink);
async function downloadImageToTemp(imageUrl) {
  const tempFile = `/tmp/image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
  try {
    const { stdout, stderr } = await execAsync(`curl -L -o "${tempFile}" "${imageUrl}"`);
    if (stderr && !stderr.includes("curl: (23)")) {
      console.warn("curl stderr:", stderr);
    }
    const stats = import_fs.default.statSync(tempFile);
    if (stats.size === 0) {
      throw new Error("Downloaded file is empty");
    }
    return tempFile;
  } catch (error) {
    throw new Error(`Failed to download image: ${error}`);
  }
}
async function getImageMetadata(imagePath) {
  try {
    const { stdout } = await execAsync(`identify -format "%w %h %m %b" "${imagePath}"`);
    const [width, height, format, size] = stdout.trim().split(" ");
    return {
      width: parseInt(width),
      height: parseInt(height),
      format: format.toLowerCase(),
      size: parseInt(size),
      aspectRatio: parseInt(width) / parseInt(height)
    };
  } catch (error) {
    throw new Error(`Failed to get image metadata: ${error}`);
  }
}
function calculateThumbnailDimensions(originalWidth, originalHeight, targetSize) {
  const isLandscape = originalWidth > originalHeight;
  const anchorDimension = isLandscape ? originalHeight : originalWidth;
  const reductionFactor = anchorDimension / targetSize;
  return {
    width: Math.round(originalWidth / reductionFactor),
    height: Math.round(originalHeight / reductionFactor)
  };
}
async function generateThumbnails(imagePath, sizes, metadata) {
  const results = [];
  const thumbnailPromises = sizes.map(async (size) => {
    const { width, height } = calculateThumbnailDimensions(metadata.width, metadata.height, size);
    const tempPath = `/tmp/thumb-${size}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;
    try {
      const convertCommand = `convert "${imagePath}" -resize ${width}x${height} -quality 85 -define webp:lossless=false "${tempPath}"`;
      await execAsync(convertCommand);
      const stats = import_fs.default.statSync(tempPath);
      if (stats.size === 0) {
        throw new Error(`Generated thumbnail for size ${size} is empty`);
      }
      results.push({
        size,
        width,
        height,
        tempPath
      });
      console.log(`\u2705 Generated ${size}px thumbnail: ${width}x${height}`);
    } catch (error) {
      console.error(`\u274C Failed to generate ${size}px thumbnail:`, error);
      throw error;
    }
  });
  await Promise.all(thumbnailPromises);
  return results;
}
async function cleanupTempFiles(filePaths) {
  const cleanupPromises = filePaths.map(async (filePath) => {
    try {
      if (import_fs.default.existsSync(filePath)) {
        await unlink(filePath);
        console.log(`\u{1F5D1}\uFE0F  Cleaned up: ${filePath}`);
      }
    } catch (error) {
      console.warn(`\u26A0\uFE0F  Failed to clean up ${filePath}:`, error);
    }
  });
  await Promise.all(cleanupPromises);
}

// index.ts
var s3 = new import_aws_sdk.default.S3();
var readFile = (0, import_util2.promisify)(import_fs2.default.readFile);
var handler = async (event) => {
  const { remote_url, bucket, key, prefix_name, sizes } = event;
  let tempImageFile = null;
  const startTime = Date.now();
  if (!remote_url || !bucket || !key || !prefix_name || !sizes || !Array.isArray(sizes)) {
    return {
      success: false,
      message: "Missing required fields: remote_url, bucket, key, prefix_name, sizes",
      thumbnails: {},
      processing: {
        time: "0ms",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalThumbnails: 0
      },
      error: "Invalid request parameters"
    };
  }
  if (sizes.length === 0 || sizes.some((size) => typeof size !== "number" || size < 16 || size > 512)) {
    return {
      success: false,
      message: "Invalid sizes array. Must contain numbers between 16 and 512",
      thumbnails: {},
      processing: {
        time: "0ms",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalThumbnails: 0
      },
      error: "Invalid thumbnail sizes"
    };
  }
  try {
    console.log("\u{1F5BC}\uFE0F  Starting image thumbnail generation...");
    console.log(`\u{1F4F7} Image URL: ${remote_url}`);
    console.log(`\u{1FAA3} S3 Bucket: ${bucket}`);
    console.log(`\u{1F511} S3 Key: ${key}`);
    console.log(`\u{1F3F7}\uFE0F  Prefix: ${prefix_name}`);
    console.log(`\u{1F4CF} Sizes: ${sizes.join(", ")}`);
    console.log("\u2B07\uFE0F  Downloading image...");
    tempImageFile = await downloadImageToTemp(remote_url);
    console.log(`\u2705 Image downloaded to: ${tempImageFile}`);
    console.log("\u{1F4CA} Getting image metadata...");
    const metadata = await getImageMetadata(tempImageFile);
    console.log(`\u{1F4D0} Image dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`\u{1F4C1} Format: ${metadata.format}`);
    console.log(`\u{1F4CF} Aspect ratio: ${metadata.aspectRatio.toFixed(2)}`);
    console.log("\u{1F504} Generating thumbnails...");
    const thumbnailResults = await generateThumbnails(tempImageFile, sizes, metadata);
    console.log(`\u2705 Generated ${thumbnailResults.length} thumbnails`);
    console.log("\u2601\uFE0F  Uploading thumbnails to S3...");
    const thumbnails = {};
    for (const result of thumbnailResults) {
      const thumbnailBuffer = await readFile(result.tempPath);
      const s3Key = `${key}/${prefix_name}_${result.size}.webp`;
      const cdnUrl = `https://cdn.delu.la/${s3Key}`;
      await s3.putObject({
        Bucket: bucket,
        Key: s3Key,
        Body: thumbnailBuffer,
        ContentType: "image/webp",
        ContentLength: thumbnailBuffer.length,
        CacheControl: "public, max-age=31536000"
        // 1 year cache
      }).promise();
      thumbnails[result.size.toString()] = {
        size: result.size,
        width: result.width,
        height: result.height,
        s3Key,
        cdnUrl,
        fileSize: thumbnailBuffer.length
      };
      console.log(`\u2705 Uploaded ${result.size}px thumbnail: ${s3Key}`);
    }
    const tempFiles = [tempImageFile, ...thumbnailResults.map((r) => r.tempPath)].filter(Boolean);
    await cleanupTempFiles(tempFiles);
    const processingTime = Date.now() - startTime;
    console.log("\u2705 All thumbnails generated and uploaded successfully!");
    console.log(`\u23F1\uFE0F  Total processing time: ${processingTime}ms`);
    return {
      success: true,
      message: "Image thumbnails generated and uploaded successfully",
      thumbnails,
      processing: {
        time: `${processingTime}ms`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalThumbnails: thumbnailResults.length
      }
    };
  } catch (err) {
    console.error("\u274C Thumbnail generation failed:", err);
    if (tempImageFile) {
      await cleanupTempFiles([tempImageFile]).catch(() => {
      });
    }
    return {
      success: false,
      message: "Failed to generate thumbnails",
      thumbnails: {},
      processing: {
        time: `${Date.now() - startTime}ms`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalThumbnails: 0
      },
      error: err.message || "Unknown error occurred"
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
