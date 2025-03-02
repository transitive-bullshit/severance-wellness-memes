import { GitHub, Twitter } from '~/icons'
import * as config from '~/lib/config'

import styles from './footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>{config.copyright}</div>

        <div className={styles.desc}>Coming summer 2024</div>

        <div className={styles.social}>
          <a href={config.twitterUrl} target='_blank' rel='noopener noreferrer'>
            <Twitter className={styles.icon} />
          </a>

          <a href={config.githubUrl} target='_blank' rel='noopener noreferrer'>
            <GitHub className={styles.icon} />
          </a>
        </div>
      </div>
    </footer>
  )
}
