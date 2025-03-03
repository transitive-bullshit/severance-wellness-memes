import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'

import { type ResolvedTwitterUser } from '@/lib'
import { prisma } from '@/lib/db'

const seedWellnessFacts = [
  'Your outie once tried to fine-tune a GPT model on their own tweets but had to stop because it became “too unhinged.”',
  'Your outie got rug-pulled by the Hawk Tuah girl.',
  "Your outie wrote a “How to Hack AI for Personal Growth” Medium post but still hasn't showered today.",
  'Your outie says “solving alignment” is their long-term goal, but their short-term goal is making a meme generator.',
  'Your outie once tweeted “I should build this” about an idea, then got mad when someone else actually built it.',
  'Your outie thinks that rewriting an app in Rust counts as “self-improvement.”',
  'Your outie refers to their Substack audience as a “decentralized knowledge network” when it’s really just 42 people and their mom.',
  'Your outie thinks “Web3 social graphs” will change networking but still can’t make eye contact at conferences.',
  'Your outie calls ChatGPT their “cofounder” in investor meetings and genuinely thinks that’s a flex.',
  'Your outie sends a weekly email to Elon Musk stating what they got done last week.',
  'Your outie creates ChatGPT wrappers and calls them startups.',
  'Your outie eats on calls without muting themselves.',
  'Your outie prefers gpt 4.5 over claude 3.7 sonnet because of the "vibes".',
  'Your outie genuinely believes that “prompt engineering” is a viable personality trait.',
  'Your outie built an AI-powered dream journal and now believes their subconscious is trying to pivot to SaaS.',
  'Your outie once called ChatGPT “bro” in a moment of weakness and now feels strangely attached to it.',
  "Your outie's git commit messages are detailed and meaningful."
]

async function main() {
  const twitterUsername = 'transitive_bs'

  const resolvedTwitterUser = JSON.parse(
    await fs.readFile(`out/${twitterUsername}.json`, 'utf8')
  ) as ResolvedTwitterUser

  const deleteWellnessSessions = prisma.wellnessSession.deleteMany({
    where: {
      OR: [
        { twitterUserId: resolvedTwitterUser.user.id_str },
        { twitterUsername: resolvedTwitterUser.user.screen_name }
      ]
    }
  })

  const createWellnessSession = prisma.wellnessSession.create({
    data: {
      twitterUserId: resolvedTwitterUser.user.id_str,
      twitterUsername: resolvedTwitterUser.user.screen_name,
      userFullName: resolvedTwitterUser.user.name,
      twitterUser: {
        create: resolvedTwitterUser
      },
      wellnessFacts: {
        create: seedWellnessFacts.map((text) => ({
          text,
          model: 'gpt-4.5-preview',
          twitterUsername: resolvedTwitterUser.user.screen_name,
          tags: ['featured']
        }))
      }
    },
    include: {
      wellnessFacts: true,
      twitterUser: {
        select: {
          user: true
        }
      }
    }
  })

  const [_, wellnessSession] = await prisma.$transaction([
    deleteWellnessSessions,
    createWellnessSession
  ])

  console.log(JSON.stringify(wellnessSession, null, 2))
}

try {
  restoreCursor()
  await main()
  gracefulExit(0)
} catch (err) {
  console.error('error', err)
  gracefulExit(1)
}
