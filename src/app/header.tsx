import Image from 'next/image'

import { ActiveLink } from '~/components'

import styles from './header.module.css'

export function Header() {
  return null
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <ActiveLink className={styles.logo} href='/'>
          <Image
            src='/lumon-logo.svg'
            alt='Lumon Logo'
            width={257}
            height={52}
            className={styles.logo}
          />
        </ActiveLink>

        <div className={styles.rhs}>
          {/* <Button asChild>
            <ActiveLink href='/signup'>Sign up</ActiveLink>
          </Button> */}
        </div>
      </div>
    </header>
  )
}
