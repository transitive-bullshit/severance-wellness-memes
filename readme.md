<p align="center">
  <a href="https://severance-wellness-memes"><img alt="Your outie likes to star random GitHub repos." src="/public/examples/hero.jpg" width="640"></a>
</p>

# Severance Wellness Memes <!-- omit from toc -->

> Roast your Twitter profile with AI-generated Severance wellness memes.

<p>
  <a href="https://github.com/transitive-bullshit/severance-wellness-memes/actions/workflows/main.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/severance-wellness-memes/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://github.com/transitive-bullshit/severance-wellness-memes/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

- [Why?](#why)
- [Examples](#examples)
- [Feedback](#feedback)
- [TODO](#todo)
- [How it works](#how-it-works)
  - [Tech stack](#tech-stack)
- [License](#license)

## Why?

The work is mysterious and important.

Praise Kier.

lol but seriously though, with [the release of GPT-4.5](https://openai.com/index/introducing-gpt-4-5/), I was really curious to see how good the latest LLMs were at generating subtle, personalized humor.

After a lot of iterating and testing with every frontier LLM, **the results were... mixed... except for GPT-4.5**, which was able to generate some genuinely funny and surprisingly nuanced jokes. In my experience, \`gpt-4.5-preview\` generates really solid results about 50% of the time, so in a batch of 10 memes, there's generally a few standouts.

## Examples

<p align="center">
  <img alt="Example meme" src="/public/examples/5.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/8.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/7.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/11.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/4.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/0.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/6.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/2.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/3.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/9.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/10.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/1.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/12.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/13.jpg" width="45%">
</p>

<p align="center">
  <img alt="Example meme" src="/public/examples/14.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Example meme" src="/public/examples/15.jpg" width="45%">
</p>

## Feedback

Feel free to send feedback by replying publicly to this [Twitter/X thread](TODO). You can also [DM me](https://x.com/transitive_bs), but I am more likely to reply if you are following me and the conversation is public.

I prefer public convos so the answers can help other people who might have similar questions, but if it's related to billing, please [DM me](https://x.com/transitive_bs).

## TODO

- MVP Launch
  - [ ] improve stripe checkout paywall
    - auto-refresh when wellness session goes from `pending` to `resolved`
    - test cache refreshing for the whole checkout flow
  - [ ] improve landing page hero section
  - [ ] double check social images for all routes
  - [ ] improve header section + mobile support
  - [ ] test across a few browsers
  - [ ] stress test database and connection limits...
- Post-MVP
  - [ ] add basic pricing page w/ explanation for why I had to add the paywall
  - [ ] add url resolving to `resolveTwitterUser` to give more context
  - [ ] show generated date and model on fact detail page
  - [ ] consider switching from prisma to drizzle
  - [ ] consider switching from supabase postgres
  - [ ] allow paying for more tweets + generations
  - [ ] track third-party fact url access and image access for stats

## How it works

The workflow to generate memes for a user:

- Fetch their twitter profile and 200 of their most recent tweets.
- Use \`gpt-4.5-preview\` to generate a list of text-based wellness facts based on a [long prompt](./src/lib/generate-wellness-facts.ts), some examples to guide the model, and the user's unfurled tweets as an array of plain text.
- Use \`gpt-4o-mini\` to try and [extract the user's full first and last name](./src/lib/extract-user-full-name.ts), so we can call them by their Severed Lumon name (eg, Helly R).
- Use [Vercel's dynamic OG image generation](https://vercel.com/docs/functions/og-image-generation#getting-started) (which is powered by [Satori](https://github.com/vercel/satori) under the hood) to generate the severance meme images on-the-fly.

### Tech stack

- [TypeScript](https://www.typescriptlang.org)
- [Next.js](https://nextjs.org)
- [Vercel](https://vercel.com)
- [OpenAI](https://openai.com)
- [Postgres](https://www.postgresql.org)
- [Prisma](https://www.prisma.io)
- [Stripe](https://stripe.com)
- [SocialDataTools](https://socialdata.tools)
- [Agentic](https://github.com/transitive-bullshit/agentic)

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)
