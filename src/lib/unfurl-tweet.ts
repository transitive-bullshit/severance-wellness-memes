import { htmlEscape, htmlUnescape } from 'escape-goat'
import { parse } from 'twemoji-parser'

import type * as types from './types'
// import { normalizeUrl } from './url-utils'

export function unfurlTweet(
  tweet: types.Tweet,
  opts: {
    twitterUser?: types.TwitterUser
    unfurlUrls?: boolean
    unfurlSubtweets?: boolean
  } = {}
): string {
  const { twitterUser, unfurlUrls = false, unfurlSubtweets = true } = opts
  const tweetIdRegex = /\/status\/(\d+)$/
  let text = tweet.full_text

  // console.log('unfurlTweet', tweet.id_str)
  const emojis = parse(text).reverse()

  const entities = [
    tweet.entities.urls?.map((url) => ({ ...url, source: 'url' })),
    (tweet.entities as any).media?.map((media: any) => ({
      ...media,
      source: 'media'
    }))
  ]
    .filter(Boolean)
    .flat()
    .sort((a, b) => b.indices[0] - a.indices[0])

  if (entities.length) {
    // eslint-disable-next-line unicorn/no-array-reduce
    text = entities.reduce((status, entity) => {
      let index0 = entity.indices[0] >= 0 ? entity.indices[0] : 0
      let index1 = entity.indices[1]

      for (const emoji of emojis) {
        const { indices } = emoji
        const diff = Math.max(0, indices[1] - indices[0] - 1)

        if (diff <= 0) {
          continue
        }

        if (index0 >= emoji.indices[0]) {
          index0 += diff
        }
        if (index1 >= emoji.indices[0]) {
          index1 += diff
        }
      }

      const prefix = status.slice(0, Math.max(0, index0))
      const suffix = status.slice(Math.max(0, index1))

      let body = ''

      if (entity.source === 'url') {
        const expandedUrl = entity.expanded_url
        if (expandedUrl) {
          body = expandedUrl

          // TODO: this will also match non-twitter URLs
          const tweetIdMatch = expandedUrl.match(tweetIdRegex)

          if (tweetIdMatch) {
            const subTweetId = tweetIdMatch[1]
            const subTweet =
              subTweetId === tweet.id_str
                ? null
                : twitterUser?.tweets[subTweetId]

            if (subTweet && unfurlSubtweets) {
              if (tweet.quoted_status_id_str === subTweetId) {
                body = `${unfurlTweet(subTweet, opts)}`
              } else {
                body = `${unfurlTweet(subTweet, opts)}`
              }
            } else {
              // if we can't find the tweet, remove the URL
              body = ''
            }
          } else if (unfurlUrls) {
            // Replace the URL with its opengraph metadata for other URLs
            // TODO
            // body = unfurlUrl(expandedUrl, { resolvedTwitterUser })
          }
        }
      } else if (entity.source === 'media') {
        const id = (entity as any).id_str
        const expandedMediaEntity = (tweet.entities as any)?.media?.find(
          (media: any) => media.id_str === id
        )

        if (expandedMediaEntity?.ext_alt_text) {
          // replace media with alt text
          body = `\n<img alt="${htmlEscape(expandedMediaEntity.ext_alt_text)}" />\n`
        } else {
          // TODO
        }
      } else {
        // TODO: handle other types of embedded entities like polls
      }

      return `${prefix}${body}${suffix}`
    }, text)
  }

  // text = text.slice(Math.max(0, tweet.display_text_range[0]))
  // text = text.replace(/[\ud800-\udfff]/g, '')

  text = htmlUnescape(text).trim()

  return text
}

// export function unfurlUrl(
//   url: string,
//   {
//     resolvedTwitterUser,
//     fallback = url
//   }: { resolvedTwitterUser?: types.ResolvedTwitterUser; fallback?: string } = {}
// ): string {
//   if (!url) return fallback
//   if (!resolvedTwitterUser) return fallback

//   const normalizedUrl = normalizeUrl(url)
//   const metadata =
//     resolvedTwitterUser.urls[url] ||
//     (normalizedUrl ? resolvedTwitterUser.urls[normalizedUrl] : undefined)
//   if (!metadata) return fallback

//   const site = metadata.siteName?.toLowerCase()
//   if (site === 'github') {
//     return metadata.title || fallback
//   }

//   let values = [metadata.title, metadata.description]
//   if (
//     site &&
//     !values.some((t) =>
//       (t ? t.toString() : '').toLowerCase().includes(site.toLowerCase())
//     )
//   ) {
//     values = [metadata.siteName].concat(values)
//   }

//   const value = Array.from(
//     new Set(values.map((value) => value?.toString().trim()).filter(Boolean))
//   ).join(' - ')

//   if (!value) {
//     return fallback
//   }

//   return value
// }
