import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { MapProps, MarkerProps, TileLayerProps } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { FiPlus } from "react-icons/fi"
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import Sidebar from '../../components/Sidebar'

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

import styles from '../../styles/pages/CreateOrphanage.module.css'

export default function CreateOrphanage() {
  const { push } = useRouter()

  const [happyMapIcon, setHappyMapIcon] = useState(undefined)

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

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng,
    })
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }

    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { latitude, longitude } = position

    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))

    images.forEach(image => {
      data.append('images', image)
    })

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orphanages`, {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error(error)
      alert('Tente novamente')
    }

    push('/orphanages')
  }

  return (
    <div id={styles.pageCreateOrphanage}>
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className={styles.createOrphanageForm}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-27.2092052, -49.6401092]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              // @ts-ignore
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
              />

              {happyMapIcon && position.latitude !== 0 &&
                <Marker
                  interactive={false}
                  icon={happyMapIcon}
                  position={[position.latitude, position.longitude]}
                />
              }
            </Map>

            <div className={styles.inputBlock}>
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className={styles.inputBlock}>
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className={styles.inputBlock}>
              <label htmlFor="images">Fotos</label>

              <div className={styles.imagesContainer}>
                {
                  previewImages.map(image => (
                    <img key={image} src={image} alt={name} />
                  ))
                }

                <label htmlFor="image[]" className={styles.newImage}>
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className={styles.inputBlock}>
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className={styles.inputBlock}>
              <label htmlFor="opening_hours">Horário de funcinamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className={styles.inputBlock}>
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className={styles.buttonSelect}>
                <button
                  type="button"
                  className={open_on_weekends ? styles.active : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? styles.active : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className={styles.confirmButton} type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  )
}