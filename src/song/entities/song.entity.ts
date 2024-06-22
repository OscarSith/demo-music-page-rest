import { Album } from 'src/album/entities/album.entity';
import { LibraryData } from 'src/libraries-data/entities/library-data.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 100 })
  picture: string;

  @Column('int')
  duration: number;

  @Column('varchar', { length: 8, default: 0 })
  playcount: string;

  @ManyToOne(() => Album, (album) => album.songs)
  album: Album;

  @OneToMany(() => LibraryData, (libraryData) => libraryData.song)
  librariesData: LibraryData[];
}
