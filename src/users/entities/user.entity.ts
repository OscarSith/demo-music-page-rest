import { Library } from 'src/libraries/entities/library.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60 })
  name: string;

  @Column('varchar', { length: 60 })
  lastname: string;

  @Column('varchar', { length: 60 })
  email: string;

  @Column('varchar', { length: 100, select: false })
  password: string;

  @OneToMany(() => Library, (library) => library.user)
  libraries: Library[];
}
