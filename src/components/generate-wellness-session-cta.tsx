import cs from 'clsx'

import { AnimatedInput } from './animated-input'

export function GenerateWellnessSessionCTA({
  className
}: {
  className?: string
}) {
  return (
    <div
      className={cs(
        'grid grid-cols-1 rounded-[2rem] shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md max-w-lg',
        className
      )}
    >
      <div className='grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5'>
        <div className='rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5'>
          <h3 className='text-3xl! font-semibold text-indigo-600 mb-0! md:leading-none text-balance text-center'>
            Create your own memes
          </h3>

          <p className='my-4 text-pretty text-md/6 text-gray-600 text-center'>
            Create your own Severance memes based on your Twitter profile. Enter
            your Twitter / X username to get started.
          </p>

          <div className='w-full max-w-lg'>
            <AnimatedInput className='light' />
          </div>
        </div>
      </div>
    </div>
  )
}
