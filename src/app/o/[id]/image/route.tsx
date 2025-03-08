import { generateWellnessFactImageResponse } from '@/lib/generate-wellness-fact-image-response'

// Image metadata
export const size = {
  width: 2400,
  height: 1200
}
export const contentType = 'image/png'
export const dynamic = 'force-static'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: wellnessFactId } = await params

  return generateWellnessFactImageResponse({ wellnessFactId })
}
