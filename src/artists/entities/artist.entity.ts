import { Album } from 'src/album/entities/album.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60 })
  name: string;

  @Column('varchar', { length: 60 })
  lastname: string;

  @Column('varchar', { length: 100 })
  avatar: string;

  @Column('text')
  bio: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    onUpdate: null,
  })
  created_at: Date;

  // It is only for search name and lastname
  @Column('varchar', { length: 200, nullable: true, select: false })
  fullname: string;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];
}
