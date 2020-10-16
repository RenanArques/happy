import Link from 'next/link'

import { FiArrowRight } from 'react-icons/fi'

import styles from '../styles/pages/Home.module.css'

import logoImg from '../assets/icon.svg'

const Home: React.FC = () => {
  return (
    <div id={styles.pageLanding}>
      <div className={styles.contentWrapper}>
        <img src={logoImg} alt="Happy" />

        <main>
          <h1>Leve felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>

        <div className={styles.location}>
          <strong>Santa Cruz do Rio Pardo</strong>
          <span>São Paulo</span>
        </div>

        <Link href="/orphanages">
          <div className={styles.enterApp}>
            <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home