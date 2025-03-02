import { z } from 'zod'

import type * as types from './types'
import { extractObject } from './ai'

export const UserFullNameSchema = z.object({
  // We want `explanation` to come first to give the model time to reason in CoT.
  explanation: z.string().optional(),

  userFullName: z.string(),

  // How positive the model is in its assessment.
  confidence: z.enum(['high', 'medium', 'low'])
})
export type UserFullName = z.infer<typeof UserFullNameSchema>

export async function extractUserFullName({
  resolvedTwitterUser,
  ctx
}: {
  resolvedTwitterUser: types.ResolvedTwitterUser
  ctx: types.AgenticContext
}): Promise<string | undefined> {
  const { user } = resolvedTwitterUser

  const result = await extractObject({
    name: 'extract_user_full_name',
    chatFn: ctx.model.run.bind(ctx.model),
    schema: UserFullNameSchema,
    injectSchemaIntoSystemMessage: false,
    params: {
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `# INSTRUCTIONS

You are an experienced data analyst. You will be given JSON data containing a user's twitter profile, and your task is to extract their most likely full name from a combination of the "screen_name" and "name" (which is their display name).

Do not invent or hallucinate potential names if you are not sure. If the data only gives an initial, then use that instead of expanding it.

You can ignore middle names. We only care about first and last name. Ignore prefixes and titles like Dr, Mr, Mrs, etc. Ignore titles like PhD.

## Output JSON Schema

Respond with JSON using the following TypeScript schema:

\`\`\`ts
interface UserFullNameSchema {
  // Explanation containing observations from the user data which might be
  // relevant to their name.
  explanation: string

  // Best guess at the user's full name.
  // NOTE: this is not their screen name or username, but their actual full name (first and last).
  userFullName: string

  // Confidence level that this is their actual full name.
  confidence: "high" | "medium" | "low"
}
\`\`\`

Make sure to think through your reasoning step-by-step in \`explanation\`.

## Examples

Input: \`{ "screen_name": "transitive_bs", "name": "Travis Fischer" }\`
Output: "Travis Fischer" (confidence "high")

Input: \`{ "screen_name": "dougf", "name": "" }\`
Output: "Doug F" (confidence "high")

Input: \`{ "screen_name": "swyx", "name": "Shawn swyx Wang (SF)" }\`
Output: "Shawn Wang" (confidence "high")

Input: \`{ "screen_name": "alexpoulos", "name": "Alex Poulos" }\`
Output: "Alex Poulos" (confidence "high")

Input: \`{ "screen_name": "hacker123", "name": "" }\`
Output: "" (unable to extract a likely full name, so set confidence to "low")

Input: \`{ "screen_name": "greg92983", "name": "Gregasaurus" }\`
Output: "Greg" (confidence "medium")

Input: \`{ "screen_name": "beauty_283", "name": "Kelly Smith (cooking up AGI)" }\`
Output: "Kelly Smith" (confidence "high")

Input: \`{ "screen_name": "diamondbishop", "name": "Diamond Bishop 🤖" }\`
Output: "Diamond Bishop" (confidence "high")

Input: \`{ "screen_name": "pimpledr", "name": "Dr Serena Williams" }\`
Output: "Serena Williams" (confidence "high")

Input: \`{ "screen_name": "0xataki", "name": "Kai" }\`
Output: "Kai" (confidence "medium")

Input: \`{ "screen_name": "philnumrich", "name": "fill" }\`
Output: "Phil Numrich" (confidence "medium")

Input: \`{ "screen_name": "Cresstation", "name": "AC" }\`
Output: "" (not enough info, so confidence "low")

## User Data

\`\`\`json
${JSON.stringify(user, null, 2)}
\`\`\`
`
        }
      ]
    }
  })

  if (
    result.userFullName &&
    (result.confidence === 'high' || result.confidence === 'medium')
  ) {
    return result.userFullName
  }

  return resolvedTwitterUser.user.name
}
