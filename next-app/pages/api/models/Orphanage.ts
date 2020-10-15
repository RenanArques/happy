import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'

import Image from './Image'

@Entity('orphanages')
export default class Orphanage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar',{ nullable:true })
  name: string;

  @Column('decimal',{ nullable:true })
  latitude: number;

  @Column('decimal',{ nullable:true })
  longitude: number;

  @Column('varchar',{ nullable:true })
  about: string;

  @Column('varchar',{ nullable:true })
  instructions: string;

  @Column('varchar',{ nullable:true })
  opening_hours: string;

  @Column('boolean',{ nullable:true })
  open_on_weekends: boolean;

  @OneToMany(() => Image, image => image.orphanage, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'orphanage_id' })
  images: Image[];
}