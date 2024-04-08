import { Library } from 'src/libraries/entities/library.entity';
import { Song } from 'src/song/entities/song.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LibraryData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp', { nullable: false, onUpdate: null })
  created_at: Date;

  @ManyToOne(() => Song, (song) => song.librariesData)
  song: Song;

  @ManyToOne(() => Library, (library) => library.librariesData)
  library: Library;
}
