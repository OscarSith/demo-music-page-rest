import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ArtistsService } from 'src/artists/artists.service';
import { unlink } from 'fs/promises';
import { changeUrlImagePath } from 'src/utils/sharedFunctions';

@Injectable()
export class AlbumService {
  private PATH_ASSSETS = 'assets/albums/';

  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private readonly artistsService: ArtistsService,
    private dataSource: DataSource,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, picture: string) {
    const artist = await this.artistsService.findOne(createAlbumDto.artistId);
    const newAlbum = this.albumRepository.create(createAlbumDto);

    newAlbum.artist = artist;
    newAlbum.picture = this.PATH_ASSSETS + picture;

    const data = await this.albumRepository.save(newAlbum);

    return {
      id: data.id,
      name: data.name,
      picture: data.picture,
      created_at: data.artist.created_at,
    } as Album;
  }

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(id: number) {
    return await this.albumRepository.findOne({ where: { id } });
  }

  findByArtist(artistId: number) {
    return this.albumRepository
      .createQueryBuilder('al')
      .innerJoin('al.artist', 'art')
      .where('al.artistId = :artistId', { artistId })
      .take(10)
      .getMany();
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto, picture: string) {
    const album = await this.findOne(id);

    if (picture) {
      updateAlbumDto.picture = this.PATH_ASSSETS + picture;
      try {
        await unlink(changeUrlImagePath(album.picture));
      } catch (error) {
        console.log(error);
        throw new HttpException(
          `No se pudo eliminar la imagen anterior "${updateAlbumDto.name}"`,
          503,
        );
      }
    }

    const albumUpdated = Object.assign(album, updateAlbumDto);
    return this.albumRepository.save(albumUpdated);
  }

  async remove(id: number) {
    const album = await this.findOne(id);

    if (album) {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const response = await this.albumRepository
        .delete({ id })
        .catch((error: QueryFailedError) => {
          console.log(error);
          throw new InternalServerErrorException();
        });

      try {
        await unlink(changeUrlImagePath(album.picture));
        console.log('Imagen del album eliminado');
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw new HttpException(
          'Ocurrió un error al intentar eliminar la imagen del album',
          500,
        );
      }

      await queryRunner.release();
      return response;
    }

    throw new HttpException('No se pudo borrar el album', 404);
  }
}
