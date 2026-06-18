import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

let cachedClient: S3Client | null = null;

function getS3Client(): S3Client {
  if (!env.aws.s3Bucket || !env.aws.accessKeyId || !env.aws.secretAccessKey) {
    throw ApiError.badRequest(
      'AWS S3 chua duoc cau hinh. Can AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY.'
    );
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: env.aws.region,
      credentials: {
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey,
      },
    });
  }
  return cachedClient;
}

function buildPublicUrl(key: string): string {
  if (env.aws.s3PublicBaseUrl) {
    return `${env.aws.s3PublicBaseUrl.replace(/\/$/, '')}/${key}`;
  }
  return `https://${env.aws.s3Bucket}.s3.${env.aws.region}.amazonaws.com/${key}`;
}

export type UploadedImage = {
  key: string;
  url: string;
  bucket: string;
  contentType: string;
  size: number;
};

// Upload buffer anh len S3 va tra ve URL cong khai.
export async function uploadImageToS3(file: {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}): Promise<UploadedImage> {
  const client = getS3Client();
  const ext = extname(file.originalname).toLowerCase() || '.bin';
  const key = `images/${randomUUID()}${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: env.aws.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    key,
    url: buildPublicUrl(key),
    bucket: env.aws.s3Bucket,
    contentType: file.mimetype,
    size: file.size,
  };
}
