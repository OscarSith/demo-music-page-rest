import { LibraryData } from 'src/libraries-data/entities/library-data.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Library {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60 })
  name: string;

  @Column('tinyint', { width: 1 })
  type: number;

  @Column('timestamp', { nullable: false, onUpdate: null })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.libraries)
  user: User;

  @OneToMany(() => LibraryData, (libraryData) => libraryData.library)
  librariesData: LibraryData[];
}
