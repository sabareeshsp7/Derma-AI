import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || ''

export async function uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)
  return `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })
  return await getSignedUrl(s3Client, command, { expiresIn })
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })
  await s3Client.send(command)
}

export async function uploadAvatar(userId: string, file: Buffer, mimeType: string): Promise<string> {
  const extension = mimeType.split('/')[1] || 'jpg'
  const key = `avatars/${userId}.${extension}`
  return await uploadFile(file, key, mimeType)
}

export async function uploadAnalysisImage(userId: string, file: Buffer, mimeType: string): Promise<{ url: string; key: string }> {
  const timestamp = Date.now()
  const extension = mimeType.split('/')[1] || 'jpg'
  const key = `analysis-images/${userId}/${timestamp}.${extension}`
  const url = await uploadFile(file, key, mimeType)
  return { url, key }
}

export async function uploadReport(userId: string, file: Buffer, filename: string): Promise<string> {
  const key = `reports/${userId}/${filename}`
  return await uploadFile(file, key, 'application/pdf')
}
