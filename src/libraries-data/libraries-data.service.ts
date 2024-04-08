import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryData } from './entities/library-data.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/song/entities/song.entity';
import { Library } from 'src/libraries/entities/library.entity';

@Injectable()
export class LibrariesDataService {
  constructor(
    @InjectRepository(LibraryData)
    private readonly libraryDataService: Repository<LibraryData>,
  ) {}

  async create(library: Library, song: Song) {
    const newLibraryData = this.libraryDataService.create();
    newLibraryData.library = library;
    newLibraryData.song = song;

    return await this.libraryDataService.save(newLibraryData);
  }
}
