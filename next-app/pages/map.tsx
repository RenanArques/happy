import { FiPlus } from 'react-icons/fi'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN

// react-leaflet components need to be imported into the browser environment
let Map, TileLayer
if (process.browser) {
  Map = require('react-leaflet').Map
  TileLayer = require('react-leaflet').TileLayer
}

import 'leaflet/dist/leaflet.css'

import mapMarkerImg from './assets/icon.svg'

import styles from '../styles/pages/OrphanagesMap.module.css'

const OrphanagesMap: React.FC = () => {
  return (
    <div id={styles.pageMap}>
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Santa Cruz do Rio Pardo</strong>
          <span>São Paulo</span>
        </footer>
      </aside>

      {Map && <Map
        center={[-22.8816433, -49.6197098]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`} />
      </Map>}

      <a href="" className={styles.createOrphanage}>
        <FiPlus size={32} color="#FFF" />
      </a>
    </div>
  )
}

export default OrphanagesMap