import { ActiveLink } from '@/components/active-link'
import { AudioToggle } from '@/components/audio-toggle'
import { DarkModeToggle } from '@/components/dark-mode-toggle'

import styles from './header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <ActiveLink className={styles.logo} href='/'>
          Lumon
        </ActiveLink>

        <div className={styles.rhs}>
          <AudioToggle />

          <DarkModeToggle />
          {/* <Button asChild>
            <ActiveLink href='/signup'>Sign up</ActiveLink>
          </Button> */}
        </div>
      </div>
    </header>
  )
}
