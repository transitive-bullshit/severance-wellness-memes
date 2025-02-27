import 'dotenv/config'

import fs from 'node:fs/promises'

import { gracefulExit } from 'exit-hook'
import restoreCursor from 'restore-cursor'
import { z } from 'zod'

import { extractObject } from '../src/ai'
import { createContext } from '../src/create-context'
import { logCacheStats } from '../src/ky-utils'
import { resolveTwitterUser } from '../src/resolve-twitter-user'

export const WellnessFactsResultSchema = z.object({
  // We want `explanation` first to give the model time to reason in CoT.
  explanation: z.string().optional(),

  wellnessFacts: z.array(z.string())
})
export type WellnessFactsResult = z.infer<typeof WellnessFactsResultSchema>

async function main() {
  const ctx = createContext()

  const user = await resolveTwitterUser('transitive_bs', ctx)

  // console.log(JSON.stringify(user, null, 2))
  await fs.writeFile(
    'out/transitive_bs.json',
    JSON.stringify(user, null, 2),
    'utf8'
  )

  const wellnessFacts = await extractObject({
    name: 'extract_wellness_facts',
    chatFn: ctx.model.run.bind(ctx.model) as any, // TODO
    schema: WellnessFactsResultSchema,
    injectSchemaIntoSystemMessage: false,
    params: {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `## INSTRUCTIONS

You are an expert data analyst.

Respond with JSON using the following TypeScript schema:

\`\`\`ts
interface WellnessFactsResult {
  // Explanation containing observations from the user data which might be
  // relevant to their wellness facts.
  explanation: string

  // Wellness facts about teh user.
  wellnessFacts: string[]
}
\`\`\`

Make sure to think through your reasoning step-by-step in \`explanation\`.

## User Data

\`\`\`json
${JSON.stringify(user.user, null, 2)}
\`\`\`

## User Tweets

\`\`\`json
${JSON.stringify(minimalEntityB, null, 2)}
\`\`\`
`
        }
      ]
    }
  })

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
