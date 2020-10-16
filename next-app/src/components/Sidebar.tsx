import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'

import mapMarkerImg from '../assets/icon.svg'

import styles from '../styles/components/Sidebar.module.css'

export default function Sidebar() {
  const { back: goBack } = useRouter()

  return (
    <aside id={styles.sidebar}>
      <img src={mapMarkerImg} alt="Happy" />

      <footer>
        <button type="button" onClick={goBack}>
          <FiArrowLeft size={24} color="#FFF" />
        </button>
      </footer>
    </aside>
  );
}