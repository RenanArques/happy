import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import cors from 'cors'

import { ensureConnection } from '../database/connection'

import OrphanagesController from '../controllers/OrphanagesController'

export default nextConnect<NextApiRequest, NextApiResponse>()
  .use(ensureConnection, cors())
  .get(async (req, res) => {
    await OrphanagesController.show(req, res)
  })