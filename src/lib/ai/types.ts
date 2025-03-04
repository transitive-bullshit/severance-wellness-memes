import type { SetOptional, Simplify } from 'type-fest'
import {
  type AIFunctionSpec,
  type AIToolSpec,
  type JSONSchema,
  type LegacyMsg,
  type Msg
} from '@agentic/core'

export interface ChatParams {
  messages: Msg[]
  model: string & {}
  functions?: AIFunctionSpec[]
  function_call?: 'none' | 'auto' | { name: string }
  tools?: AIToolSpec[]
  tool_choice?:
    | 'none'
    | 'auto'
    | 'required'
    | { type: 'function'; function: { name: string } }
  parallel_tool_calls?: boolean
  logit_bias?: Record<string, number>
  logprobs?: boolean
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  response_format?:
    | {
        type: 'text'
      }
    | {
        type: 'json_object'
      }
    | {
        type: 'json_schema'
        json_schema: ResponseFormatJSONSchema
      }
  seed?: number
  stop?: string | null | Array<string>
  temperature?: number
  top_logprobs?: number
  top_p?: number
  user?: string
}

export type LegacyChatParams = Simplify<
  Omit<ChatParams, 'messages'> & { messages: LegacyMsg[] }
>

export interface ResponseFormatJSONSchema {
  /**
   * The name of the response format. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  name: string

  /**
   * A description of what the response format is for, used by the model to
   * determine how to respond in the format.
   */
  description?: string

  /**
   * The schema for the response format, described as a JSON Schema object.
   */
  schema?: JSONSchema

  /**
   * Whether to enable strict schema adherence when generating the output. If
   * set to true, the model will always follow the exact schema defined in the
   * `schema` field. Only a subset of JSON Schema is supported when `strict`
   * is `true`. Currently only supported by OpenAI's
   * [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs).
   */
  strict?: boolean
}

/**
 * OpenAI has changed some of their types, so instead of trying to support all
 * possible types, for these params, just relax them for now.
 */
export type RelaxedChatParams = Simplify<
  Omit<ChatParams, 'messages' | 'response_format'> & {
    messages: any[]
    response_format?: any
  }
>

/** An OpenAI-compatible chat completions API */
export type ChatFn = (
  params: Simplify<SetOptional<RelaxedChatParams, 'model'>>
) => Promise<{ message: Msg | LegacyMsg }>

export type AIChainResult = string | Record<string, any>

export type AIChain<Result extends AIChainResult = string> = (
  params?:
    | string
    | Simplify<SetOptional<Omit<ChatParams, 'tools' | 'functions'>, 'model'>>
) => Promise<Result>
