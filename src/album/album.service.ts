import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { ArtistsService } from 'src/artists/artists.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private readonly artistsService: ArtistsService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const artist = await this.artistsService.findOne(createAlbumDto.artistId);
    const newAlbum = this.albumRepository.create(createAlbumDto);
    newAlbum.artist = artist;

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

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);
    const albumUpdated = Object.assign(album, updateAlbumDto);

    return this.albumRepository.save(albumUpdated);
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
