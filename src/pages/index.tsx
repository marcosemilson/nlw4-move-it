import { profile } from 'console'
import { CompletedChallenges } from '../Components/CompletedChallenges'
import { Countdown } from '../Components/Countdown'
import { ExperienceBar } from '../Components/ExperienceBar'
import { Profile } from '../Components/Profile'
import styles from '../styles/Pages/Home.module.css'
import Head from 'next/head'
import { ChallengeBox } from '../Components/ChallengeBox'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Inicio | Move-it</title>
      </Head>
      <ExperienceBar />

      <section>
        <div>
          <Profile />
          <CompletedChallenges />
          <Countdown />
        </div>
        <div>
          <ChallengeBox />
        </div>
      </section>
    </div>
  )
}
  