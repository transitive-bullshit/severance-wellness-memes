import Link from 'next/link'

import { ActiveLink } from '@/components/active-link'
import { GitHub, Twitter } from '@/icons'
import { copyright, githubUrl, twitterUrl } from '@/lib/config'

const exampleUsers = [
  {
    twitterUsername: 'elonmusk',
    displayName: 'Elon Musk'
  },
  {
    twitterUsername: 'barackobama',
    displayName: 'Barack Obama'
  },
  {
    twitterUsername: 'realdonaldtrump',
    displayName: 'Donald Trump'
  },
  {
    twitterUsername: 'transitive_bs',
    displayName: 'Travis Fischer'
  },
  {
    twitterUsername: 'rauchg',
    displayName: 'Guillermo Rauch'
  },
  {
    twitterUsername: 'Paul Graham',
    displayName: 'paulg'
  },
  {
    twitterUsername: 'sama',
    displayName: 'Sam Altman'
  },
  {
    twitterUsername: 'balajis',
    displayName: 'Balaji'
  },
  {
    twitterUsername: 'tszzl',
    displayName: 'Roon'
  },
  {
    twitterUsername: 'karpathy',
    displayName: 'Andrej Karpathy'
  },
  {
    twitterUsername: 'pmarca',
    displayName: 'Marc Andreessen'
  },
  {
    twitterUsername: 'naval',
    displayName: 'Naval'
  },
  {
    twitterUsername: 'Beyonce',
    displayName: 'Beyoncé'
  },
  {
    twitterUsername: 'TrungTPhan',
    displayName: 'Trung Phan'
  },
  {
    twitterUsername: 'BillGates',
    displayName: 'Bill Gates'
  },
  {
    twitterUsername: 'lexfridman',
    displayName: 'Lex Fridman'
  },
  {
    twitterUsername: 'chamath',
    displayName: 'Chamath'
  },
  {
    twitterUsername: 'KimKardashian',
    displayName: 'Kim K'
  },
  {
    twitterUsername: 'Christiano',
    displayName: 'Cristiano Ronaldo'
  },
  {
    twitterUsername: 'BenStiller',
    displayName: 'Ben Stiller'
  },
  {
    twitterUsername: 'KingJames',
    displayName: 'KingJames'
  },
  {
    twitterUsername: 'levelsio',
    displayName: 'Pieter Levels'
  },
  {
    twitterUsername: 'waitbutwhy',
    displayName: 'Tim Urban'
  },
  {
    twitterUsername: 'rihanna',
    displayName: 'Rihanna'
  },
  {
    twitterUsername: 'taylorswift13',
    displayName: 'Taylor Swift'
  },
  {
    twitterUsername: 'kanyewest',
    displayName: 'Kanye West'
  },
  {
    twitterUsername: 'joerogan',
    displayName: 'Joe Rogan'
  }
]

export function Footer2() {
  return (
    <footer className='w-full py-12 border-t flex flex-col items-center'>
      <div className='container px-4 md:px-6 max-w-1200px'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='flex flex-col md:items-center'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Site</h3>
              <nav className='flex flex-col space-y-2'>
                <ActiveLink href='/' className='hover:underline'>
                  Home
                </ActiveLink>

                <ActiveLink href='/examples' className='hover:underline'>
                  Examples
                </ActiveLink>

                <ActiveLink href='/about' className='hover:underline'>
                  About
                </ActiveLink>
              </nav>
            </div>
          </div>

          <div className='flex flex-col order-last md:order-none'>
            <div className='space-y-4 flex flex-col w-full'>
              <h3 className='text-lg font-semibold'>Example Users</h3>
              <div className='grid grid-cols-[repeat(auto-fill,_minmax(8em,_1fr))] gap-y-2 gap-x-8 w-full flex-auto'>
                {exampleUsers.map((user) => (
                  <ActiveLink
                    key={user.twitterUsername}
                    href={`/x/${user.twitterUsername}`}
                    className='hover:underline'
                  >
                    {user.displayName}
                  </ActiveLink>
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col md:items-center'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Social</h3>
              <nav className='flex flex-col space-y-2'>
                <Link
                  href={twitterUrl}
                  className='flex items-center space-x-2 hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Twitter className='h-4 w-4' />
                  <span>Twitter</span>
                </Link>

                <Link
                  href={githubUrl}
                  className='flex items-center space-x-2 hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <GitHub className='h-4 w-4' />
                  <span>GitHub</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground'>
          <span>{copyright}</span>
        </div>
      </div>
    </footer>
  )
}
