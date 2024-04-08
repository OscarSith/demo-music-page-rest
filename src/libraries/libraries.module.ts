import { Module } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { LibrariesController } from './libraries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { SongModule } from 'src/song/song.module';
import { UsersModule } from 'src/users/users.module';
import { LibrariesDataModule } from 'src/libraries-data/libraries-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Library]),
    SongModule,
    UsersModule,
    LibrariesDataModule,
  ],
  controllers: [LibrariesController],
  providers: [LibrariesService],
})
export class LibrariesModule {}
