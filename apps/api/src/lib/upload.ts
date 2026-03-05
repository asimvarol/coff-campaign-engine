import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

interface UploadResult {
  url: string
  key: string
  size: number
}

function getS3Client(): S3Client | null {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) return null

  return new S3Client({
    region: process.env.AWS_REGION || 'eu-central-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
}

const BUCKET = process.env.S3_BUCKET || 'coff-uploads'
const CDN_URL = process.env.CDN_URL || `https://${BUCKET}.s3.amazonaws.com`

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function uploadFile(
  buffer: Buffer,
  contentType: string,
  folder: string
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(`Unsupported file type: ${contentType}. Allowed: ${ALLOWED_TYPES.join(', ')}`)
  }

  if (buffer.length > MAX_SIZE) {
    throw new Error(`File too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB. Max: 10MB`)
  }

  const ext = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1]
  const key = `${folder}/${randomUUID()}.${ext}`

  const client = getS3Client()
  if (!client) {
    // Fallback: return placeholder when S3 not configured
    return {
      url: `https://placehold.co/1080x1080/1a1a2e/e91e63?text=Upload+Preview`,
      key,
      size: buffer.length,
    }
  }

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  return {
    url: `${CDN_URL}/${key}`,
    key,
    size: buffer.length,
  }
}

export async function deleteFile(key: string): Promise<void> {
  const client = getS3Client()
  if (!client) return

  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}

export async function uploadFromUrl(imageUrl: string, folder: string): Promise<UploadResult> {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)

  const contentType = res.headers.get('content-type') || 'image/png'
  const buffer = Buffer.from(await res.arrayBuffer())

  return uploadFile(buffer, contentType, folder)
}
