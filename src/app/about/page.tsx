/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { Markdown } from '@/components/markdown'
import { UserAvatar } from '@/components/user-avatar'
import { WellnessFactById } from '@/components/wellness-fact-by-id'
import { WellnessFactGalleryByIds } from '@/components/wellness-fact-gallery-by-ids'
import * as config from '@/lib/config'

import styles from './styles.module.css'

export const dynamic = 'force-static'

export default async function Page() {
  return (
    <>
      <section className={styles.page}>
        <div className={styles.meta}>
          <h1 className={styles.title}>About</h1>
        </div>

        <Markdown className={styles.markdown}>
          <h1>What is this?</h1>

          <p>
            This site lets you roast any Twitter profile with AI-generated
            Severance wellness memes.
          </p>

          <p>
            It takes your Twitter profile and your most recent tweets, and it
            uses an LLM to generate Severance memes like this one:
          </p>

          <WellnessFactById
            wellnessFactId='cm7uapehe000a2rk24aoebpnq'
            priority={true}
            className={styles.embed}
          />

          <h2 className='text-balance'>
            Examples Roasting <Link href='x/realDonaldTrump'>Donald Trump</Link>
            <UserAvatar
              user={{
                screen_name: 'realDonaldTrump',
                name: 'Donald Trump',
                profile_image_url_https:
                  'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg'
              }}
              type='profile'
              className='ml-3'
            />
          </h2>

          <p>
            <b>All memes are personalized</b> to the user's profile and most
            recent tweets. Take{' '}
            <Link href='/x/realDonaldTrump'>Donald Trump</Link> for example:
          </p>

          <WellnessFactGalleryByIds
            wellnessFactIds={[
              'cm7uapehe000b2rk22cyn72ik',
              'cm7uapehe000k2rk228t5qs8f',
              'cm7uapehe00012rk2h2l4jlob',
              'cm7uapehe000j2rk26wdfyc64'
            ]}
            className={styles.embed}
          />

          <h2 className='text-balance'>
            Examples Roasting{' '}
            <Link href={`${config.url}/x/sama`}>Sam Altman</Link>
            <UserAvatar
              user={{
                screen_name: 'sama',
                name: 'Sam Altman',
                profile_image_url_https:
                  'https://pbs.twimg.com/profile_images/804990434455887872/BG0Xh7Oa_400x400.jpg'
              }}
              type='profile'
              className='ml-3'
            />
          </h2>

          <WellnessFactGalleryByIds
            wellnessFactIds={[
              'cm7u2o5mo000d2ra2alzzend7',
              'cm7vv9he300002r5gfoem2ulj',
              'cm7vv9he300042r5gfki2cd8p',
              'cm7vv9he300032r5gewc4ik1n'
            ]}
            className={styles.embed}
          />

          <h1>Why?</h1>

          <p>
            <b>Because the work is mysterious and important.</b>
          </p>

          <p>Praise Kier.</p>

          <p>
            <i>lol</i> but seriously though, with{' '}
            <Link
              href='https://openai.com/index/introducing-gpt-4-5/'
              target='_blank'
              rel='noopener noreferrer'
            >
              the release of GPT-4.5
            </Link>
            , I was really curious to see how good the latest LLMs were at
            generating subtle, personalized humor.
          </p>

          <p>
            After a lot of iterating and testing with every frontier LLM,{' '}
            <strong>the results were... mixed... except for GPT-4.5</strong>,
            which was able to generate some genuinely funny and surprisingly
            nuanced jokes. In my experience, <code>gpt-4.5-preview</code>{' '}
            generates really solid results about 50% of the time, so in a batch
            of 10 memes, I expect you to really like a few and be happy with
            about half of them.
          </p>

          <h1>How it works</h1>

          <p>The workflow to generate memes for a user:</p>

          <ul>
            <li>
              Fetch their twitter profile and 200 of their most recent tweets.
            </li>

            <li>
              Use <code>gpt-4.5-preview</code> to generate a list of text-based
              wellness facts based on a long prompt, some examples to guide the
              model, and the user's unfurled tweets as an array of plain text.
            </li>

            <li>
              Use <code>gpt-4o-mini</code> to try and extract the user's full
              first and last name, so we can call them by their Severed Lumon
              name (eg, Helly R).
            </li>

            <li>
              Use{' '}
              <Link
                href='https://vercel.com/docs/functions/og-image-generation#getting-started'
                target='_blank'
                rel='noopener noreferrer'
              >
                Vercel's dynamic OG image generation
              </Link>{' '}
              (which is powered by{' '}
              <Link
                href='https://github.com/vercel/satori'
                target='_blank'
                rel='noopener noreferrer'
              >
                Satori
              </Link>{' '}
              under the hood) to generate the severance meme images on-the-fly.
            </li>
          </ul>

          <p>
            For more details, check out the{' '}
            <Link
              href={config.githubUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              full source code on GitHub
            </Link>
            .
          </p>

          <h1>Tech stack</h1>

          <ul>
            <li>
              <Link
                href='https://www.typescriptlang.org'
                target='_blank'
                rel='noopener noreferrer'
              >
                TypeScript
              </Link>
            </li>
            <li>
              <Link
                href='https://nextjs.org'
                target='_blank'
                rel='noopener noreferrer'
              >
                Next.js
              </Link>
            </li>
            <li>
              <Link
                href='https://vercel.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                Vercel
              </Link>
            </li>
            <li>
              <Link
                href='https://openai.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                OpenAI
              </Link>
            </li>
            <li>
              <Link
                href='https://www.postgresql.org'
                target='_blank'
                rel='noopener noreferrer'
              >
                Postgres
              </Link>
            </li>
            <li>
              <Link
                href='https://www.prisma.io'
                target='_blank'
                rel='noopener noreferrer'
              >
                Prisma
              </Link>
            </li>
            <li>
              <Link
                href='https://stripe.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                Stripe
              </Link>
            </li>
            <li>
              <Link
                href='https://socialdata.tools'
                target='_blank'
                rel='noopener noreferrer'
              >
                SocialDataTools
              </Link>
            </li>
            <li>
              <Link href='https://github.com/transitive-bullshit/agentic'>
                Agentic
              </Link>
            </li>
          </ul>

          <h1>Feedback</h1>

          <p>
            Feel free to send feedback by replying publicly to this{' '}
            <Link
              href={config.twitterLaunchThreadUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              Twitter/X thread
            </Link>
            . You can also{' '}
            <Link
              href={config.twitterUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              DM me
            </Link>
            , but I am more likely to reply if you are following me and the
            conversation is public.
          </p>

          <p>
            I prefer public convos so the answers can help other people who
            might have similar questions, but if it's related to billing, please{' '}
            <Link
              href={config.twitterUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              DM me
            </Link>
            .
          </p>

          <h1>
            Credits
            <Link href='/x/transitive_bs' className='ml-3 inline'>
              <Image
                alt='Travis Fischer'
                src='https://pbs.twimg.com/profile_images/1347656662463766529/igIs8izN_400x400.png'
                width={400}
                height={400}
                className='inline-block! size-10 rounded-full ring-1 ring-accent-foreground'
              />
            </Link>
          </h1>

          <p>
            <strong>
              This website is not affiliated with Apple, Severance, Lumon,
              Endeavor Content, Red Hour Productions, Fifth Season, or anything
              else remotely official.
            </strong>
          </p>

          <p>
            This is a fan site created by{' '}
            <Link
              href={config.twitterUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {config.author}
            </Link>
            . The{' '}
            <Link
              href={config.githubUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              full source code is available
            </Link>{' '}
            (MIT License).
          </p>

          <p>
            A huge shoutout to{' '}
            <Link
              href='https://en.wikipedia.org/wiki/Dichen_Lachman'
              target='_blank'
              rel='noopener noreferrer'
            >
              Dichen Lachman
            </Link>
            , the amazing actress who plays Gemma on Severance. Also a huge
            shoutout to the cast &amp; crew of Severance for creating one of the
            best shows on TV and inspiring this mysterious and important work.
          </p>

          <p>
            I used{' '}
            <Link
              href='https://x.com/grapplingdev/status/1891513175125672133'
              target='_blank'
              rel='noopener noreferrer'
            >
              several
            </Link>{' '}
            <Link
              href='https://x.com/neversitdull/status/1891208701811339665'
              target='_blank'
              rel='noopener noreferrer'
            >
              tweets
            </Link>{' '}
            <Link
              href='https://x.com/iamdevloper/status/1892223162114343376'
              target='_blank'
              rel='noopener noreferrer'
            >
              as
            </Link>{' '}
            <Link
              href='https://x.com/rauchg/status/1892036628182598133'
              target='_blank'
              rel='noopener noreferrer'
            >
              inspiration
            </Link>{' '}
            to seed the LLM prompt's examples.
          </p>

          <p>
            See the <Link href='/legal'>legal docs</Link> for more details.
          </p>
        </Markdown>
      </section>
    </>
  )
}
