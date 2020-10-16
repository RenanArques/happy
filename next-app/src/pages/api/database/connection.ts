import "reflect-metadata"

import {Connection, getConnectionManager, getConnectionOptions} from 'typeorm'
import path from 'path'

import Orphanage from '../models/Orphanage'
import Image from '../models/Image'

const entities = [Orphanage, Image]

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true
  }

  return false
}

async function updateConnectionEntities(connection: Connection, entities: any[]) {
  if (!entitiesChanged(connection.options.entities, entities)) return

  // @ts-ignore
  connection.options.entities = entities

  // @ts-ignore
  connection.buildMetadatas()

  if (connection.options.synchronize) {
    await connection.synchronize()
  }
}

export async function ensureConnection(req, res, next) {
  const connectionManager = getConnectionManager()

  if (connectionManager.has('default')) {
    req.db = connectionManager.get()

    req.db.isConnected || await req.db.connect()

    if (process.env.NODE_ENV !== 'production') {
      await updateConnectionEntities(req.db, Object.values(entities))
    }
  } else {
    req.db = await connectionManager
      .create(process.env.NODE_ENV === 'production' ? {
        type: 'postgres',
        url: process.env.POSTGRES_URL,
        entities: Object.values(entities),
        migrations: [path.resolve() + '/src/pages/api/database/migrations'],
      } : {
        ...await getConnectionOptions(),
        type: 'sqlite',
        database: path.resolve() + '/src/pages/api/database/database.sqlite',
        entities: Object.values(entities),
        migrations: [path.resolve() + '/src/pages/api/database/migrations'],
      })
      .connect()
  }

  return next()
}