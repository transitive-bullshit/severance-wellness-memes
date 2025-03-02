import styles from './styles.module.css'

export default async function Page({
  params
}: {
  params: Promise<{ twitterUsername: string }>
}) {
  const { twitterUsername } = await params

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <h1 className={styles.title}>
          Twitter user &quot;{twitterUsername}&quot; not found.
        </h1>
      </section>
    </div>
  )
}

// export async function generateStaticParams() {
// const posts = await fetch('https://.../posts').then((res) => res.json())
// return posts.map((post) => ({
//   slug: post.slug
// }))
// }
