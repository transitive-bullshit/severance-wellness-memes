import { generateWellnessFactImageResponse } from '@/lib/generate-wellness-fact-image-response'

export const contentType = 'image/png'
export const dynamic = 'force-static'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: wellnessFactId } = await params

  return generateWellnessFactImageResponse({ wellnessFactId })
}
