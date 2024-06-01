import { HttpException, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
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
  ) {}

  async create(createAlbumDto: CreateAlbumDto, picture: string) {
    const artist = await this.artistsService.findOne(createAlbumDto.artistId);
    const newAlbum = this.albumRepository.create(createAlbumDto);

    newAlbum.artist = artist;
    newAlbum.picture = this.PATH_ASSSETS + picture;

    return await this.albumRepository.save(newAlbum);
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

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
