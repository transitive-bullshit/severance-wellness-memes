import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.wellnessFact}>
        <div className={styles.wellnessFactTextContainer}>
          <div className={styles.wellnessFactText}>
            Your Outie eats on calls without muting themselves.
          </div>
        </div>
      </div>
    </div>
  )
}
