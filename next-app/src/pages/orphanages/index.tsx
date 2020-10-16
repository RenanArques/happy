import { useState, useEffect } from 'react'
import { MapProps, MarkerProps, PopupProps, TileLayerProps } from 'react-leaflet'
import { FiArrowRight, FiPlus } from 'react-icons/fi'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const Map = dynamic<MapProps>(
  async (): Promise<any> => (await import('react-leaflet')).Map,
  { ssr: false }
)

const Marker = dynamic<MarkerProps>(
  async (): Promise<any> => (await import('react-leaflet')).Marker,
  { ssr: false }
)

const TileLayer = dynamic<TileLayerProps>(
  async (): Promise<any> => (await import('react-leaflet')).TileLayer,
  { ssr: false }
)

const Popup = dynamic<PopupProps>(
  async (): Promise<any> => (await import('react-leaflet')).Popup,
  { ssr: false }
)

import mapMarkerImg from '../../assets/icon.svg'

import styles from '../../styles/pages/OrphanagesMap.module.css'

interface Orphanage {
  id: number
  latitude: number
  longitude: number
  name: string
}

function OrphanagesMap({ data }) {
  const orphanages: Orphanage[] = data

  const [happyMapIcon, setHappyMapIcon] = useState(undefined)

  useEffect(() => {
    const createHappyMapIcon = async () => {
      const L = await require('leaflet')
      setHappyMapIcon(
        L.icon({
          iconUrl: mapMarkerImg,
          iconSize: [58, 68],
          iconAnchor: [29, 68],
          popupAnchor: [170, 2]
        })
      )
    }
    createHappyMapIcon()
  }, [])

  return (
    <div id={styles.pageMap}>
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um orfanato no mapa</h2>

          <p>Muitas crianças estão esperando a sua visita {':)'}</p>
        </header>

        <footer>
          <strong>Rio do Sul</strong>
          <span>Santa Catarina</span>
        </footer>
      </aside>

      <Map
        center={[-27.2092052, -49.6401092]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`} />

        {happyMapIcon && orphanages.map(orphanage => (
          <Marker
            key={orphanage.id}
            icon={happyMapIcon}
            position={[orphanage.latitude, orphanage.longitude]}
          >
            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
              {orphanage.name}
              <Link href={`/orphanages/${orphanage.id}`}>
                <div className="link">
                  <FiArrowRight size={20} color="#fff" />
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link href="/orphanages/new">
        <div className={styles.createOrphanage}>
          <FiPlus size={32} color="#fff" />
        </div>
      </Link>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orphanages`)
  const data = await res.json()

  return { props: { data } }
}


export default OrphanagesMap