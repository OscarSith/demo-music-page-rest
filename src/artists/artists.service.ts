import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { DataSource, Like, QueryFailedError, Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { changeUrlImagePath } from 'src/utils/sharedFunctions';

@Injectable()
export class ArtistsService {
  private PATH_ASSSETS = 'assets/avatar/';

  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private dataSource: DataSource,
  ) {}

  async create(createArtistDto: CreateArtistDto, filename: string) {
    createArtistDto.avatar = this.PATH_ASSSETS + filename;
    createArtistDto.fullname =
      createArtistDto.name + ' ' + createArtistDto.lastname;
    // Esta manera es mas eficiente de agregar que el método save()
    const data = await this.artistRepository
      .createQueryBuilder()
      .insert()
      .values(createArtistDto)
      .execute();
    return this.findOne(data.raw['insertId']);

    // const newData = await this.artistRepository.save(createArtistDto);
    // return this.findOne(newData.id);
  }

  findAll() {
    return this.artistRepository.find();
  }

  findOne(id: number) {
    return this.artistRepository.findOne({ where: { id } });
  }

  searchByName(name: string) {
    return this.artistRepository
      .createQueryBuilder('artist')
      .select(['artist.id', 'artist.fullname'])
      .where({ fullname: Like(`%${name}%`) })
      .take(8)
      .getMany();
  }

  async update(id: number, updateArtistDto: UpdateArtistDto, avatar: string) {
    const artist = await this.findOne(id);

    // this is for remove the old image only if it any file uploaded
    if (avatar) {
      updateArtistDto.avatar = this.PATH_ASSSETS + avatar;
      try {
        await unlink(changeUrlImagePath(artist.avatar));
      } catch (error) {
        console.log(error);
        throw new HttpException(
          `No se pudo eliminar la imagen anterior "${updateArtistDto.name}"`,
          500,
        );
      }
    }

    updateArtistDto.fullname =
      updateArtistDto.name + ' ' + updateArtistDto.lastname;
    const data = Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(data);
  }

  async remove(id: number) {
    const artist = await this.findOne(id);
    if (artist) {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const response = await this.artistRepository
        .delete({ id })
        .catch((reason: QueryFailedError) => {
          // 1451 => Error trying to delete a data with foreign dependences
          if (reason.driverError['errno'] === 1451) {
            throw new HttpException(
              'No se pudo borrar el artista, tiene albunes asociados',
              500,
            );
          }

          throw new InternalServerErrorException();
        });

      try {
        console.log('IMAGEN ELIMINADO');
        await unlink(changeUrlImagePath(artist.avatar));
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw new HttpException(
          'Ocurrió un error al intentar eliminar el archivo',
          500,
        );
      }

      await queryRunner.release();
      return response;
    }

    throw new HttpException('No se pudo borrar el artista', 404);
  }

  // just for fill fullname
  async fillFullname() {
    const artists = await this.findAll();
    const resps = [];
    artists.forEach((artist) => {
      const resp = this.artistRepository
        .createQueryBuilder()
        .update()
        .set({ fullname: artist.name + ' ' + artist.lastname })
        .where('id = :id', { id: artist.id })
        .execute();

      resps.push(resp);
    });

    return resps;
  }
}
