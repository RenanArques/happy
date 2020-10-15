import { NextApiRequest, NextApiResponse } from 'next'
import { getRepository } from 'typeorm'
import Formidable from 'formidable'
import * as Yup from 'yup'
import path from 'path'

import orphanageView from '../views/orphanages_view'

import Orphanage from '../models/Orphanage'
import Image from '../models/Image'

export default {
  async index(req: NextApiRequest, res: NextApiResponse) {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return res.json(orphanageView.renderMany(orphanages))
  },

  async show(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (typeof id !== 'string') {
      return res.status(400).json({
        message: 'Bad Request',
        errors: ['id must be a number greater than 0']
      })
    }

    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    })

    return res.json(orphanageView.render(orphanage))
  },

  async create(req: NextApiRequest, res: NextApiResponse) {
    const form = new Formidable({
      multiples: true,
      uploadDir: path.resolve() + '/public/uploads',
      keepExtensions: true
    })

    form.parse(req, async (error, fields, files) => {
      if (error) return res.status(500).json('Internal server error')

      if (files.images.length === undefined) {
        files.images = [files.images]
      }
      
      const images: Image[] = files.images.map((image) => {
        return { path: image.path.split('/public')[1] }
      })

      const {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends
      } = fields
      
      const orphanagesRepository = getRepository(Orphanage)

      const data = {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
        images
      }

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        about: Yup.string().max(300).required(),
        instructions: Yup.string().required(),
        opening_hours: Yup.string().required(),
        open_on_weekends: Yup.boolean().required(),
        images: Yup.array(Yup.object().shape({
          path: Yup.string().required(),
        })),
      })
      
      try {
        await schema.validate(data, { abortEarly: false })
      } catch (error) {
        const { errors } = error
        return res.status(400).json({ message: 'Bad Request', errors })
      }
      
      const orphanage = orphanagesRepository.create(data)
      
      await orphanagesRepository.save(orphanage)
      
      return res.status(201).json(orphanageView.render(orphanage))
    })
  }
}