import { useState, useEffect } from 'react'
import { FaWhatsapp } from "react-icons/fa"
import { FiClock, FiInfo } from "react-icons/fi"
import { MapProps, MarkerProps, TileLayerProps } from 'react-leaflet'

import Sidebar from '../../components/Sidebar'

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

import mapMarkerImg from '../../assets/icon.svg'

import styles from '../../styles/pages/Orphanage.module.css'

interface Orphanage {
  latitude: number
  longitude: number
  name: string
  about: string
  instructions: string
  opening_hours: string
  open_on_weekends: boolean
  images: Array<{
    id: number
    url: string
  }>
}

function Orphanage({ data }) {
  const orphanage: Orphanage = data

  const [happyMapIcon, setHappyMapIcon] = useState(undefined)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const createHappyMapIcon = async () => {
      const L = await require('leaflet')
      setHappyMapIcon(
        L.icon({
          iconUrl: mapMarkerImg,
          iconSize: [58, 68],
          iconAnchor: [29, 68],
          popupAnchor: [0, -60]
        })
      )
    }
    createHappyMapIcon()
  }, [])

  return (
    <div id={styles.pageOrphanage}>
      <Sidebar />

      <main>
        <div className={styles.orphanageDetails}>
          <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name} />

          <div className={styles.images}>
            {orphanage.images.map((image, index) => (
              <button
                key={image.id}
                className={activeImageIndex === index ? styles.active : ''}
                type="button"
                onClick={() => {
                  setActiveImageIndex(index)
                }}
              >
                <img src={image.url} alt={orphanage.name} />
              </button>
            ))}
          </div>

          <div className={styles.orphanageDetailsContent}>
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className={styles.mapContainer}>
              {happyMapIcon &&
                <Map
                  center={[orphanage.latitude, orphanage.longitude]}
                  zoom={16}
                  style={{ width: '100%', height: 280 }}
                  dragging={false}
                  touchZoom={false}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                >
                  <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                  />

                  <Marker
                    interactive={false}
                    icon={happyMapIcon}
                    position={[orphanage.latitude, orphanage.longitude]}
                  />
                </Map>
              }

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className={styles.openDetails}>
              <div className={styles.hour}>
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className={styles.openOnWeekends}>
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                  <div className={styles.dontOpenOnWeekends}>
                    <FiInfo size={32} color="#FF6690" />
                  Não Atendemos <br />
                  fim de semana
                  </div>
                )}
            </div>

            {
              //<button type="button" className={styles.contactButton}>
              //  <FaWhatsapp size={20} color="#FFF" />
              //  Entrar em contato
              //</button>
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orphanages/${params.id}`)
  const data = await res.json()

  return { props: { data } }
}

export async function getStaticPaths() {
  return Promise.resolve({
    paths: [],
    fallback: 'unstable_blocking'
  })
}

export default Orphanage