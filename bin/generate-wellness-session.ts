import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'
import { z } from 'zod'

import type { ResolvedTwitterUser } from '../src/types'
import { extractObject } from '../src/ai'
import { createContext } from '../src/create-context'
import { logCacheStats } from '../src/ky-utils'
import { unfurlTweet } from '../src/unfurl-tweet'
// import { resolveTwitterUser } from '../src/resolve-twitter-user'

export const WellnessFactsResultSchema = z.object({
  // We want `explanation` first to give the model time to reason in CoT.
  explanation: z.string().optional(),

  wellnessFacts: z.array(z.string())
})
export type WellnessFactsResult = z.infer<typeof WellnessFactsResultSchema>

async function main() {
  const ctx = createContext()

  const resolvedTwitterUser = JSON.parse(
    await fs.readFile('out/transitive_bs.json', 'utf8')
  ) as ResolvedTwitterUser

  const user = JSON.parse(
    await fs.readFile('out/travis-fischer.json', 'utf8')
  ) as any

  const tweets = resolvedTwitterUser.timelineTweetIds
    .map((id) => {
      return resolvedTwitterUser.tweets[id]
    })
    .filter((tweet) => {
      if (!tweet) return false
      // if (tweet.is_retweet) return false

      return true
    })
    .filter(Boolean)
  const unfurledTweets = tweets.map((tweet) =>
    unfurlTweet(tweet, {
      resolvedTwitterUser
    })
  )

  // const user = await resolveTwitterUser('transitive_bs', ctx)

  // // console.log(JSON.stringify(user, null, 2))
  // await fs.writeFile(
  //   'out/transitive_bs.json',
  //   JSON.stringify(user, null, 2),
  //   'utf8'
  // )

  const positive = false

  const result = await extractObject({
    name: 'extract_wellness_facts',
    chatFn: ctx.model.run.bind(ctx.model),
    schema: WellnessFactsResultSchema,
    injectSchemaIntoSystemMessage: false,
    params: {
      // model: 'gpt-4o-mini',
      model: 'gpt-4.5-preview',
      temperature: 1.0,
      messages: [
        {
          role: 'system',
          content: `## INSTRUCTIONS

You are a writer for the TV show Severance. Your task is to write wellness facts for the given user, which will be presented to them in a wellness session. In Severance, every employee has two distinct personalities: their "Innie," who exists solely within Lumon Industries, and their "Outie," who lives their personal life outside of work. The show is a dark comedic thriller that explores the dystopian consequences of this arrangement.

${
  positive
    ? `
- Wellness facts are positive affirmations about the user's Outie.
- Wellness facts should focus on the user's good qualities.
- Wellness facts should be written in a positive and affirming tone. They should be encouraging and uplifting, focusing on the user's strengths and positive qualities.
`
    : `
- Wellness facts are short, condescending, humorous platitudes about the user's Outie.
- Wellness facts should be written in a condescending tone, poking fun at the user's quirks and idiosyncrasies.
- Wellness facts should be slightly cringeworthy and make the Innie embarrassed to be related to their Outie.
- The goal is to create humorous and lighthearted wellness facts that are entertaining and amusing.
`
}
- Each wellness fact must start with "Your Outie".
- Wellness facts MUST be specific and detailed, referencing specific aspects from the included user data and tweets, highlighting the user's unique qualities and characteristics.
- Wellness facts should be short, concise, and easy to understand. They are meant to be shared on Twitter.
- Users are highly active online twitter and reddit users who love the show Severance and internet memes in general, so feel free to include references to the show or popular internet culture in the wellness facts.
- Many users are tech-savvy and work in the tech industry, so AI and tech-related jokes or references are also welcome.

## Severance TV Show

Employees at the biotechnology corporation Lumon Industries, assigned to highly classified projects, must undergo "severance"—a medical procedure that implants a device in their brain ensuring they retain no memories of the outside world while at work and no recollection of their job once they leave. This results in two distinct personalities for each employee: the "innie," who exists solely within Lumon, and the "outie," who lives their personal life outside of work.

### Wellness Sessions

The Wellness Center, or simply Wellness, is a department on the Severed floor. It is used for wellness sessions with the innies of the severed departments.

- Wellness sessions are conducted by the Wellness Director, Ms Casey, who provides wellness facts to the user's innie.
${
  positive
    ? `
- Wellness sessions are meant to provide positive affirmations and encouragement.
- Wellness sessions are designed to boost morale and improve mental well-being.
- Wellness sessions are mean to be relaxing and enjoyable, but in practice end up being slightly unsettling and bizarre. Ms Casey's wellness facts are often strange and cryptic, leaving the user feeling confused and uncomfortable.
- Wellness sessions are conducted in a darkly comedic tone, with a touch of absurdity and surrealism.
`
    : `
- Wellness sessions are meant to roast the user's Outie in a lighthearted and humorous way.
- Wellness sessions should poke fun at the user's unique interests, quirks, and idiosyncrasies.
- Wellness sessions are mean to be relaxing and enjoyable, but in practice end up being slightly unsettling and bizarre. Ms Casey's wellness facts are often strange and cryptic, leaving the user feeling confused and uncomfortable.
- Wellness sessions are conducted in a darkly comedic tone, with a touch of absurdity and surrealism.
- Wellness sessions are designed to leave the user's Innie feeling slightly embarrassed and cringe about their Outie.
`
}
- The user's Innie is expected to remain silent and listen to the wellness facts without interruption.
- If the user tries to speak during the wellness session, arbitrary, meaningless points will be deducted, and Ms Casey will get increasingly frustrated.

Some dialogue from the show's wellness sessions by Ms Casey to give a feel for the tone and language used in the wellness facts:

- "All right, Irving. What I’d like to do is share with you some facts about your Outie. Because your Outie is an exemplary person, these facts should be very pleasing. Just relax your body and be open to the facts. Try to enjoy each equally. These facts are not to be shared outside this room. But for now, they’re yours to enjoy."
- "I’m sorry. Please try to enjoy each fact equally, and not show preference for any over the others. That’s ten points off. You have 90 points remaining."
- "Please don’t speak further, or all remaining points will be deducted and the wellness session will end."
- "Upon request, I can also perform a hug."
- "I really liked being in the office with you all that day. I know I vexed you. I know I’m… strange."
- "My life has been 107 hours long. Most of that has been these half-hour sessions. For me, my favorite time was the eight hours I spent in your department watching Helly. It’s the longest I’ve ever been awake. I suppose it’s what you could call my good old days."

### Characters

Ms. Casey, formerly known as Gemma, is the wife of Mark Scout. She was a Russian literature professor at Ganz College and the former wellness counselor on the Severed Floor at Lumon Industries. She was considered a part-time employee, and it is generally accepted that those employees do not leave Lumon, though she believed that she had an outie. At the time of the events of season 1, Gemma was presumed to have died 2 years ago in a car crash, leaving Mark’s outie mourning and depressed. However, Mark’s innie discovered in The We We Are that she was still alive and was known as Ms. Casey.

At the end of her tenure as Wellness Director for the Severed floor, when she was sent down to the Testing Floor, Ms. Casey informs Mark that she had been alive for 107 hours, or just under the equivalent of 4.5 days, most of which was lived in short thirty-minute wellness sessions. Taking the full day she observed Helly R. into consideration, it could be presumed that she provided weekly wellness sessions for around a year, or served in that capacity less frequently for longer.

${
  positive
    ? `
### Example Wellness Facts from the show

- Your Outie is kind.
- Your Outie has brightened people’s days by merely smiling.
- Your Outie makes time for people even when they’re slow and dawdling.
- Your Outie is courteous to strangers without expectation of reward.
- Your Outie can set up a tent in under three minutes.
- Your Outie knows a beautiful rock from a plain one.
- Your Outie enjoys giving hugs to the poor.
- Your Outie is gentle.
- Your Outie will ascend to Heaven upon his death if such a place exists.
- Your Outie is a motorist.
- Your Outie spells and punctuates his written sentences in the proper way.
- Your Outie is honest to law enforcement workers.
- Your Outie gives food and money to the destitute.
- Your Outie can make a (flophouse) or apartment feel like a home.
- Your Outie makes pleasing noises.
- Your Outie can leap admirably but does not do so to show off.
- Your Outie is admired by domesticated animals.
- Your Outie waits patiently in lines.
- Your Outie can pick up an animal without injuring it.
- Your Outie dances like nobody is watching.
- Your Outie eats pitted fruits in moderation.
- Your Outie always remembers a face.
- Your outie prefers two scoops of ice cream in a serving, but they must be the same flavor.
`
    : ''
}

### Example Output Wellness Facts

${
  positive
    ? `
- Your Outie loves going down YouTube rabbit holes.
- Your Outie's git commit messages are detailed and meaningful.
- Your Outie sends a weekly email to Elon Musk stating what they got done last week.
- Your Outie handles every single error by pattern matching Option/Result types. No exception goes uncaught. He carefully defines React error boundaries with helpful user messages.
- Your Outie has diamond hands.
- Your Outie is a big fan of SBF.
- Your Outie engages in a daily ritual they refer to as shitposting.
- Your Outie has access to millions of TV shows but chooses to rewatch the same one about a paper company in Pennsylvania.
- Your Outie builds beautiful, unique design tokens and components.
- Your Outie has a large collection of NFTs.
- Your Outie never ships a prompt without evals
- Your Outie uses pointers, and knows how to prevent memory leaks.
- Your Outie loves filling out expense reports and has a special folder for them.
- Your Outie posts only bangers.
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
- Your Outie is a startup founder. They have 12 LLCs, 37 domains, and not a single paying customer.
- Your Outie loves creating AI demos that will never be made into real products.
- Your Outie creates ChatGPT wrappers and calls them startups.
- Your Outie excels at correcting people's grammar without them asking.
- Your Outie ships code and refers to himself as a ninja.
- Your Outie has strong opinions about TypeScript and shares them without asking.
- Your Outie does not use an automatic code formatter.
- Your Outie lost $24,000 on DraftKings last year.
- Your Outie is obsessed with a variety of mediocre New York sports franchises.
- Your Outie often explains AI concepts to people who didn’t ask.
- Your Outie doesn't believe in mansplaining, and will explain why even if you didn't ask.
- Your Outie eats on calls without muting themselves.
- Your Outie orders pineapple on their pizza.
- Your Outie prefers the gpt 4.5 over claude 3.7 sonnet because of the "vibes"
- Your Outie has strong opinions about the Palmer Luckey and Jason Calacanis feud.
- Your Outie has a collection of rare Pepe memes.
- Your Outie has thousands of friends on social media but only talks to 3 people in real life.
- Your Outie is uses Stack Overflow and believes that LLMs are a fad.
- Your Outie daytrades shitcoins.
- Your Outie uses VSCode and believes that AI programming is a fad.
- Your Outie has an anime profile pic but has never watched Dragon Ball Z.
`
}

**Remember that wellness facts MUST be specific and detailed, referencing specific aspects from the included user data and tweets, highlighting the user's unique qualities and characteristics.**

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
${JSON.stringify(user, null, 2)}
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

  console.log(JSON.stringify(result, null, 2))
  logCacheStats(ctx)
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
