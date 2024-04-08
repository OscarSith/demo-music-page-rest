import { Module } from '@nestjs/common';
import { LibrariesDataService } from './libraries-data.service';
import { LibrariesDataController } from './libraries-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryData } from './entities/library-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryData])],
  controllers: [LibrariesDataController],
  providers: [LibrariesDataService],
  exports: [LibrariesDataService],
})
export class LibrariesDataModule {}
