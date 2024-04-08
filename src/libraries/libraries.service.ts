import { Injectable } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { DataSource, Repository } from 'typeorm';
import { SongService } from 'src/song/song.service';
import { UsersService } from 'src/users/users.service';
import { LibrariesDataService } from 'src/libraries-data/libraries-data.service';
import { User } from 'src/users/entities/user.entity';
import { CreateLibraryDataDto } from './dto/create-library-data.dto';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
    private readonly songRepository: SongService,
    private readonly userRepository: UsersService,
    private readonly librariesDataRepository: LibrariesDataService,
    private dataSource: DataSource,
  ) {}

  async create(
    createLibraryDto: CreateLibraryDto,
    userId: number,
  ): Promise<Library> {
    const user = await this.userRepository.findOne(userId);
    const newLibrary = this.libraryRepository.create(createLibraryDto);
    newLibrary.user = user;

    return await this.libraryRepository.save(newLibrary);
  }

  async createfavorite(songId: number, userId: number) {
    const user = await this.userRepository.findOne(userId);
    const song = await this.songRepository.findOne(songId);
    const queryRunner = this.dataSource.createQueryRunner();
    let libraryCreated: Library;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const libraryFavorite = await this.findFavorite(user);
      if (libraryFavorite !== null) {
        libraryCreated = libraryFavorite;
      } else {
        const newLibrary = this.libraryRepository.create({
          type: 1,
          name: 'Favoritos',
        });
        newLibrary.user = user;

        libraryCreated = await this.libraryRepository.save(newLibrary);
      }

      await this.librariesDataRepository.create(libraryCreated, song);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }

    await queryRunner.release();

    return libraryCreated;
  }

  async addDataToLibrary(
    createLibraryDataDto: CreateLibraryDataDto,
  ): Promise<boolean> {
    const song = await this.songRepository.findOne(createLibraryDataDto.songId);
    const library = await this.findOne(createLibraryDataDto.libraryId);

    await this.librariesDataRepository.create(library, song);

    return true;
  }

  findAll() {
    return this.libraryRepository.find();
  }

  findOne(id: number): Promise<Library> {
    return this.libraryRepository.findOne({ where: { id } });
  }

  private findFavorite(user: User): Promise<Library> {
    return this.libraryRepository.findOne({ where: { user, type: 1 } });
  }

  update(id: number, updateLibraryDto: UpdateLibraryDto) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
