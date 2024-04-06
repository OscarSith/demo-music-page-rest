import { Artist } from 'src/artists/entities/artist.entity';
import { Song } from 'src/song/entities/song.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60 })
  name: string;

  @Column('varchar', { length: 100 })
  picture: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    onUpdate: null,
  })
  created_at: Date;

  @ManyToOne(() => Artist, (artist) => artist.albums)
  artist: Artist;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];
}
