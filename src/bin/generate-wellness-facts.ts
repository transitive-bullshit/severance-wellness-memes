import 'dotenv/config'

// import fs from 'node:fs/promises'
import { assert } from '@agentic/core'
import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

// import { createContext } from '@/lib/create-context'
import { prisma } from '@/lib/db'
// import { generateWellnessFacts } from '@/lib/generate-wellness-facts'

async function main() {
  // const ctx = createContext()

  const twitterUsername = 'sama'
  // const resolvedTwitterUser = JSON.parse(
  //   await fs.readFile(`out/${twitterUsername}.json`, 'utf8')
  // ) as types.ResolvedTwitterUser
  const resolvedTwitterUser = await prisma.twitterUser.findUnique({
    where: {
      twitterUsername
    }
  })
  assert(resolvedTwitterUser, `Twitter user ${twitterUsername} not found`)

  // const result = await generateWellnessFacts({
  //   resolvedTwitterUser,
  //   ctx
  // })
  // console.log(JSON.stringify(result.wellnessFacts, null, 2))

  const result = {
    model: 'gpt-4.5-preview',
    wellnessFacts: [
      "Your outie refers to new model releases as existential experiences but still can't properly name them.",
      'Your outie hyped a revolutionary AI model and then immediately told everyone to lower their expectations 100x.',
      "Your outie ironically jokes about mechanical turking ChatGPT, even though that's literally his company's business model.",
      "Your outie's version of humility is admitting his hyped-up AI 'still has flaws' after declaring it has AGI vibes.",
      "Your outie calls his online audience 'high taste testers', yet mostly addresses Reddit and Twitter shitposters.",
      "Your outie recounts his high school's AI questions but conveniently omits how many wedgies that talk cost him.",
      "Your outie refers to AI as 'AGI and beyond' like he's narrating Buzz Lightyear fanfiction.",
      "Your outie thinks 'going deep in fusion research' casually counts as exploring nature.",
      'Your outie suggested OpenAI would buy Twitter for an ultra-specific $9.74 billion just for shits & giggles.'
    ]
  }

  console.log(
    result.wellnessFacts.map((text) => ({
      text,
      model: result.model,
      twitterUserId: resolvedTwitterUser.user.id_str,
      twitterUsername: resolvedTwitterUser.user.screen_name,
      tags: []
    }))
  )

  const wellnessFacts = await prisma.wellnessFact.createMany({
    data: result.wellnessFacts.map((text) => ({
      text,
      model: result.model,
      twitterUserId: resolvedTwitterUser.user.id_str,
      twitterUsername: resolvedTwitterUser.user.screen_name
    }))
  })

  console.log(JSON.stringify(wellnessFacts, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
