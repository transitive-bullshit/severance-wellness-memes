import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

import type * as types from './types'
import { unfurlTweet } from './unfurl-tweet'

export const GeneratedWellnessFactsSchema = z.object({
  // We want `explanation` first to give the model time to reason in CoT.
  explanation: z.string().optional(),

  wellnessFacts: z.array(z.string())
})
export type GeneratedWellnessFacts = z.infer<
  typeof GeneratedWellnessFactsSchema
>

export type GenerateWellnessFactsResult = GeneratedWellnessFacts & {
  model: string
}

export async function generateWellnessFacts({
  twitterUser,
  positive = false,

  // meh
  // model = 'gpt-4o-mini'
  // model = 'gpt-4o',
  // model = 'o3-mini',
  // pretty solid
  // model = 'o1',
  model = 'gpt-4.5-preview'
}: {
  twitterUser: types.TwitterUser
  ctx?: types.AgenticContext
  positive?: boolean
  model?: string
}): Promise<GenerateWellnessFactsResult> {
  const tweets = twitterUser.timelineTweetIds
    .map((id) => {
      return twitterUser.tweets[id]
    })
    .filter(Boolean)
  const unfurledTweets = tweets.map((tweet) =>
    unfurlTweet(tweet, {
      twitterUser
    })
  )

  const { object: result } = await generateObject({
    model: openai(model),
    schema: GeneratedWellnessFactsSchema,
    temperature: 0,
    system: `# INSTRUCTIONS

You are a writer for the TV show Severance. Your task is to write wellness facts for the given user, which will be presented to them in a wellness session. In Severance, every employee has two distinct personalities: their "innie," who exists solely within Lumon Industries, and their "outie," who lives their personal life outside of work. The show is a dark comedic thriller that explores the dystopian consequences of this arrangement.

## Wellness Facts

${
  positive
    ? `
- Wellness facts are positive affirmations about the user's outie.
- Wellness facts should focus on the user's good qualities.
- Wellness facts should be written in a positive and affirming tone. They should be encouraging and uplifting, focusing on the user's strengths and positive qualities.
`
    : `
- Wellness facts are short, condescending, humorous, satirical platitudes about the user's outie.
- Wellness facts are meant to roast the user in a lighthearted, humorous, self-aware tone.
- Wellness facts should be written in a condescending tone, poking fun at the user's quirks and idiosyncrasies.
- Wellness facts may contradict the user's strongest beliefs in an attempt to elicit humor and make the user cringe.
- Wellness facts poke fun at the user's archetypes (ex engineers, founders, internet personalities, writers, etc) by highlighting obsessive, niche habits that might seem eccentric to outsiders but are oddly relatable within these circles.
- For tech users, wellness facts may refer to topics and jokes from the satirical TV show Silicon Valley.
- The goal is to create humorous and lighthearted wellness facts that are entertaining and amusing.
`
}
- Each wellness fact must start with "Your outie".
- Wellness facts should try to reference specific aspects from the included user data and tweets in order to to highlight the user's unique qualities and characteristics.
- Wellness facts should be short, concise, and easy to understand. They are meant to be shared on Twitter.
- The user is highly active on twitter and reddit. They love the show Severance and internet memes in general, so feel free to include references to popular internet culture.
- The user is tech-savvy and likely works in the tech industry, so AI and tech-related jokes are also welcome.

### Example Wellness Facts

${
  positive
    ? `
- Your outie loves going down YouTube rabbit holes.
- Your outie's git commit messages are detailed and meaningful.
- Your outie sends a weekly email to Elon Musk stating what they got done last week.
- Your outie handles every single error by pattern matching Option/Result types. No exception goes uncaught. He carefully defines React error boundaries with helpful user messages.
- Your outie engages in a daily ritual they refer to as shitposting.
- Your outie builds beautiful, unique design tokens and components.
- Your outie has a large collection of NFTs.
- Your outie uses pointers, and knows how to prevent memory leaks.
- Your outie loves filling out expense reports and has a special folder for them.
- Your outie posts only bangers.
- Your outie orders pineapple on their pizza.
- Your outie uses their iPhone without a case and has managed to keep it pristine, never dropping or scratching it.
- Your outie believes Bryan Johnson looks like a vampire.
- Your outie says "please" and "thank you" to ChatGPT.
`
    : `
- Your outie likes complaining about React and other frontend frameworks on Twitter.
- Your outie has registered over 300 domains.
- Your outie enjoys purchasing online courses, but never completes them.
- Your outie knows the difference between a font and a typeface.
- Your outie got rug-pulled by the Hawk Tuah girl.
- Your outie gets investment advice from Jim Cramer.
- Your outie sends a weekly email to Elon Musk stating what they got done last week.
- Your outie is a startup founder with 12 LLCs, 37 domains, and not a single paying customer.
- Your outie loves creating AI demos that will never be made into real products.
- Your outie creates ChatGPT wrappers and calls them startups.
- Your outie excels at correcting people's grammar without them asking.
- Your outie has strong opinions about TypeScript and shares them without asking.
- Your outie lost $24,000 on DraftKings last year.
- Your outie is obsessed with a variety of mediocre New York sports franchises.
- Your outie eats on calls without muting themselves.
- Your outie prefers gpt 4.5 over claude 3.7 sonnet because of the "vibes".
- Your outie has a collection of rare Pepe memes.
- Your outie claims to have diamond hands but really just daytrades shitcoins.
`
}

## Output JSON

Respond with JSON using the following TypeScript schema:

\`\`\`ts
interface WellnessFactsResult {
  // Explanation containing observations from the user data which might be
  // relevant to their wellness facts.
  explanation: string

  // Wellness facts about the user. Should be 10-15 facts.
  wellnessFacts: string[]
}
\`\`\`

Make sure to think through your reasoning step-by-step in \`explanation\`.

## User Data

\`\`\`json
${JSON.stringify(twitterUser.user, null, 2)}
\`\`\`

### User Tweet Data

\`\`\`json
${JSON.stringify(unfurledTweets, null, 2)}
\`\`\`
`
  })

  return {
    ...result,
    model
  }
}
