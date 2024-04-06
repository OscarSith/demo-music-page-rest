import { Album } from 'src/album/entities/album.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('varchar', { length: 8 })
  playcount: string;

  @ManyToOne(() => Album, (album) => album.songs)
  album: Album;
}
