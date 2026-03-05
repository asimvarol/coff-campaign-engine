import { Hono } from 'hono'
import { uploadFile, deleteFile, uploadFromUrl } from '../lib/upload'

export const uploadRouter = new Hono()

// POST /api/upload — multipart file upload
uploadRouter.post('/', async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body['file']
    const folder = (body['folder'] as string) || 'general'

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file provided' }, 400)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadFile(buffer, file.type, folder)

    return c.json({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('Upload error:', error)
    return c.json({ error: message }, 400)
  }
})

// POST /api/upload/from-url — upload from external URL
uploadRouter.post('/from-url', async (c) => {
  try {
    const { url, folder } = await c.req.json<{ url: string; folder?: string }>()

    if (!url) return c.json({ error: 'URL is required' }, 400)

    const result = await uploadFromUrl(url, folder || 'general')
    return c.json({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('Upload from URL error:', error)
    return c.json({ error: message }, 400)
  }
})

// DELETE /api/upload/:key — delete file
uploadRouter.delete('/:key{.+}', async (c) => {
  try {
    const key = c.req.param('key')
    await deleteFile(key)
    return c.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Delete failed' }, 500)
  }
})
