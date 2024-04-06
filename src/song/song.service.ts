import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Repository } from 'typeorm';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly albumService: AlbumService,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const album = await this.albumService.findOne(createSongDto.albumId);
    const newSong = this.songRepository.create(createSongDto);
    newSong.album = album;

    return await this.songRepository.save(newSong);
  }

  findAll() {
    return this.songRepository.find();
  }

  findOne(id: number) {
    return this.songRepository.findOne({ where: { id } });
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    const song = this.findOne(id);
    const newData = Object.assign(song, updateSongDto);

    return this.songRepository.save(newData);
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
