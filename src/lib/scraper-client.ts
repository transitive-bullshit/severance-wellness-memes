import { getEnv } from '@agentic/core'
import defaultKy, { type KyInstance } from 'ky'
import pMap from 'p-map'
import pMemoize from 'p-memoize'
import QuickLRU from 'quick-lru'

export type ScrapeResult = {
  author: string
  byline: string
  /** The HTML for the main content of the page. */
  content: string
  description: string
  imageUrl: string
  lang: string
  length: number
  logoUrl: string
  /** The text for the main content of the page in markdown format. */
  markdownContent: string
  publishedTime: string
  /** The raw HTML response from the server. */
  rawHtml: string
  siteName: string
  /** The text for the main content of the page. */
  textContent: string
  title: string
}

/**
 * This is a single endpoint API for scraping websites. It returns the HTML,
 * markdown, and plaintext for main body content of the page, as well as
 * metadata like title and description.
 *
 * It tries the simplest and fastest methods first, and falls back to slower
 * proxies and JavaScript rendering if needed.
 */
export class ScraperClient {
  readonly apiBaseUrl: string
  readonly ky: KyInstance
  readonly _cache: QuickLRU<string, ScrapeResult>

  constructor({
    apiBaseUrl = getEnv('SCRAPER_API_BASE_URL'),
    ky = defaultKy
  }: {
    apiKey?: string
    apiBaseUrl?: string
    ky?: KyInstance
  } = {}) {
    if (!apiBaseUrl) {
      throw new Error('SCRAPER_API_BASE_URL is required')
    }

    this.apiBaseUrl = apiBaseUrl
    this.ky = ky.extend({ prefixUrl: this.apiBaseUrl })

    this._cache = new QuickLRU<string, ScrapeResult>({
      maxSize: 4000
    })

    this.scrapeUrl = pMemoize(this._scrapeUrl.bind(this), {
      cache: this._cache
    })
  }

  readonly scrapeUrl: (
    url: string,
    opts?: { timeout?: number }
  ) => Promise<ScrapeResult>

  protected async _scrapeUrl(
    url: string,
    {
      timeout = 60_000
    }: {
      timeout?: number
    } = {}
  ): Promise<ScrapeResult> {
    return this.ky
      .post('scrape', {
        json: { url },
        timeout
      })
      .json()
  }

  async scrapeUrls(
    urls: string[],
    {
      concurrency = 4
    }: {
      concurrency?: number
    } = {}
  ): Promise<Record<string, ScrapeResult | undefined>> {
    return Object.fromEntries(
      await pMap(
        urls,
        async (url) => {
          try {
            const scrapedUrl = await this.scrapeUrl(url)
            if (!scrapedUrl) return [url, undefined]

            return [url, scrapedUrl]
          } catch {}

          return [url, undefined]
        },
        {
          concurrency
        }
      )
    )
  }
}
