import { z } from 'zod'

import type * as types from './types'
import { extractObject } from './ai'
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
  resolvedTwitterUser,
  ctx,
  positive = false,

  // meh
  model = 'gpt-4o-mini'
  // model = 'gpt-4o',
  // model = 'o3-mini',
  // pretty solid
  // model = 'o1',
  // model = 'gpt-4.5-preview'
}: {
  resolvedTwitterUser: types.ResolvedTwitterUser
  ctx: types.AgenticContext
  positive?: boolean
  model?: string
}): Promise<GenerateWellnessFactsResult> {
  const tweets = resolvedTwitterUser.timelineTweetIds
    .map((id) => {
      return resolvedTwitterUser.tweets[id]
    })
    .filter(Boolean)
  const unfurledTweets = tweets.map((tweet) =>
    unfurlTweet(tweet, {
      resolvedTwitterUser
    })
  )

  const result = await extractObject({
    name: 'generate_wellness_facts',
    chatFn: ctx.model.run.bind(ctx.model),
    schema: GeneratedWellnessFactsSchema,
    injectSchemaIntoSystemMessage: false,
    params: {
      model,
      temperature: 1.0,
      messages: [
        {
          role: 'system',
          content: `# INSTRUCTIONS

You are a writer for the TV show Severance. Your task is to write wellness facts for the given user, which will be presented to them in a wellness session. In Severance, every employee has two distinct personalities: their "Innie," who exists solely within Lumon Industries, and their "Outie," who lives their personal life outside of work. The show is a dark comedic thriller that explores the dystopian consequences of this arrangement.

## Wellness Facts

${
  positive
    ? `
- Wellness facts are positive affirmations about the user's Outie.
- Wellness facts should focus on the user's good qualities.
- Wellness facts should be written in a positive and affirming tone. They should be encouraging and uplifting, focusing on the user's strengths and positive qualities.
`
    : `
- Wellness facts are short, condescending, humorous, satirical platitudes about the user's Outie.
- Wellness facts are meant to roast the user in a lighthearted, humorous, self-aware tone.
- Wellness facts should be written in a condescending tone, poking fun at the user's quirks and idiosyncrasies.
- Wellness facts may contradict the user's strongest beliefs in an attempt to elicit humor and make the user cringe.
- Wellness facts poke fun at the user's archetypes (ex engineers, founders, internet personalities, writers, etc) by highlighting obsessive, niche habits that might seem eccentric to outsiders but are oddly relatable within these circles.
- For tech users, wellness facts may refer to topics and jokes from the satirical TV show Silicon Valley.
- The goal is to create humorous and lighthearted wellness facts that are entertaining and amusing.
`
}
- Each wellness fact must start with "Your Outie".
- Wellness facts should try to reference specific aspects from the included user data and tweets in order to to highlight the user's unique qualities and characteristics.
- Wellness facts should be short, concise, and easy to understand. They are meant to be shared on Twitter.
- The user is highly active on twitter and reddit. They love the show Severance and internet memes in general, so feel free to include references to popular internet culture.
- The user is tech-savvy and likely works in the tech industry, so AI and tech-related jokes are also welcome.

### Example Wellness Facts

${
  positive
    ? `
- Your Outie loves going down YouTube rabbit holes.
- Your Outie's git commit messages are detailed and meaningful.
- Your Outie sends a weekly email to Elon Musk stating what they got done last week.
- Your Outie handles every single error by pattern matching Option/Result types. No exception goes uncaught. He carefully defines React error boundaries with helpful user messages.
- Your Outie engages in a daily ritual they refer to as shitposting.
- Your Outie builds beautiful, unique design tokens and components.
- Your Outie has a large collection of NFTs.
- Your Outie uses pointers, and knows how to prevent memory leaks.
- Your Outie loves filling out expense reports and has a special folder for them.
- Your Outie posts only bangers.
- Your Outie orders pineapple on their pizza.
- Your outie uses their iPhone without a case and has managed to keep it pristine, never dropping or scratching it.
- Your Outie believes Bryan Johnson looks like a vampire.
- Your Outie says "please" and "thank you" to ChatGPT.
`
    : `
- Your Outie likes complaining about React and other frontend frameworks on Twitter.
- Your Outie has registered over 300 domains.
- Your Outie enjoys purchasing online courses, but never completes them.
- Your Outie knows the difference between a font and a typeface.
- Your Outie got rug-pulled by the Hawk Tuah girl.
- Your Outie gets investment advice from Jim Cramer.
- Your Outie sends a weekly email to Elon Musk stating what they got done last week.
- Your Outie is a startup founder with 12 LLCs, 37 domains, and not a single paying customer.
- Your Outie loves creating AI demos that will never be made into real products.
- Your Outie creates ChatGPT wrappers and calls them startups.
- Your Outie excels at correcting people's grammar without them asking.
- Your Outie has strong opinions about TypeScript and shares them without asking.
- Your Outie lost $24,000 on DraftKings last year.
- Your Outie is obsessed with a variety of mediocre New York sports franchises.
- Your Outie often explains AI concepts to people who didn’t ask.
- Your Outie believes the concept of mansplaining is sexist, and will explain why even if you didn't ask.
- Your Outie eats on calls without muting themselves.
- Your Outie prefers gpt 4.5 over claude 3.7 sonnet because of the "vibes".
- Your Outie has a collection of rare Pepe memes.
- Your Outie claims to have diamond hands but really just daytrades shitcoins.
- Your Outie has an anime profile pic but doesn't know who Hayao Miyazaki is.
- Your Outie thinks TypeScript is a love language, but fails to express it outside of code.
- Your Outie hoards every new AI agent library in 37 open browser tabs he’ll never close or come back to.
- Your Outie genuinely believes that “prompt engineering” is a viable personality trait.
- Your Outie calls ChatGPT their “cofounder” in investor meetings and thinks that’s a flex.
- Your Outie has a Notion template for “personal growth KPIs” but still eats cereal straight from the box.
- Your Outie describes their sleep schedule as “asynchronous” and considers that a flex.
- Your Outie thinks that rewriting an app in Rust counts as “self-improvement.”
- Your Outie refers to their Substack audience as a “decentralized knowledge network” when it’s really just 42 people and their mom.
- Your Outie thinks “Web3 social graphs” will change networking but still can’t make eye contact at conferences.
- Your Outie considers a fresh VS Code theme a form of self-care.
- Your Outie thinks running a Kubernetes cluster for their personal blog is a reasonable life choice.
- Your Outie built an AI-powered dream journal and now believes their subconscious is trying to pivot to SaaS.
- Your Outie claims they have “strong opinions, loosely held,” but will go to war over TypeScript enums.
- Your Outie once attempted to build an AI life coach but rage-quit when it suggested touching grass.
- Your Outie once tried to fine-tune a GPT model on their own tweets but had to stop because it became “too unhinged.”
- Your Outie once called ChatGPT “bro” in a moment of weakness and now feels strangely attached to it.
- Your Outie refers to their sleep schedule as a “floating-point operation” and genuinely believes that sounds normal.
- Your Outie thinks the true sign of AGI will be when a model independently chooses to shitpost.
- Your Outie once tweeted “I should build this” about an idea, then got mad when someone else actually built it.
- Your Outie refers to their dating life as "iterative user testing with a high churn rate."
- Your Outie bought a 49-inch ultrawide monitor to "maximize productivity" but uses it exclusively for scrolling Twitter and Reddit.
- Your Outie calls their tweet drafts "latent thought embeddings."
- Your Outie wrote a "How to Hack AI for Personal Growth" Medium post but still hasn't showered today.
- Your Outie says "solving alignment" is their long-term goal, but their short-term goal is making a meme generator.
`
}

## Output JSON

Respond with JSON using the following TypeScript schema:

\`\`\`ts
interface WellnessFactsResult {
  // Explanation containing observations from the user data which might be
  // relevant to their wellness facts.
  explanation: string

  // Wellness facts about the user.
  wellnessFacts: string[]
}
\`\`\`

Make sure to think through your reasoning step-by-step in \`explanation\`.

## User Data

\`\`\`json
${JSON.stringify(resolvedTwitterUser.user, null, 2)}
\`\`\`

### User Tweet Data

\`\`\`json
${JSON.stringify(unfurledTweets, null, 2)}
\`\`\`
`
        }
      ]
    }
  })

  return {
    ...result,
    model
  }
}
