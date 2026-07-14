import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import crypto from "crypto";

const s3 = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file, folderName) => {
  const ext = path.extname(file.originalname);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const bucket = process.env.AWS_BUCKET_NAME;
  const key = `${folderName}/${filename}`;

  console.log(`Uploading ${filename} to S3...`);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file?.buffer,
    ContentType: file?.mimetype,
  });

  try {
    await s3.send(command);
    const url = `https://${bucket}.s3.ca-central-1.amazonaws.com/${key}`;
    console.log(`Upload successful: ${url}`);
    return url;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw err;
  }
};

/**
 * Deletes an image from S3 given its full URL
 * @param {string} imageUrl - The full URL of the image (e.g. https://your-bucket.s3.ca-central-1.amazonaws.com/folder/file.png)
 */
export const deleteFromS3 = async (imageUrl) => {
  try {
    const bucket = process.env.AWS_BUCKET_NAME;

    const urlPrefix = `https://${bucket}.s3.ca-central-1.amazonaws.com/`;
    const key = imageUrl.replace(urlPrefix, "");

    if (!imageUrl.startsWith(urlPrefix)) {
      console.log("Skipping delete — image is not from S3:", urlPrefix);
      return true;
    }
    if (!key || key.includes("https://")) {
      throw new Error("Invalid image URL or bucket mismatch.");
    }

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3.send(command);
    console.log(`Deleted successfully: ${key}`);
    return true;
  } catch (err) {
    console.error("S3 Delete Error:", err);
    throw err;
  }
};
