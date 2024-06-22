import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Repository } from 'typeorm';
import { AlbumService } from 'src/album/album.service';
import getAudioDurationInSeconds from 'get-audio-duration';

@Injectable()
export class SongService {
  private PATH_ASSSETS = 'assets/songs/';

  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly albumService: AlbumService,
  ) {}

  async create(createSongDto: CreateSongDto, song: Express.Multer.File) {
    const album = await this.albumService.findOne(createSongDto.albumId);
    const newSong = this.songRepository.create(createSongDto);
    const duration = await getAudioDurationInSeconds(song.path);

    newSong.album = album;
    newSong.picture = this.PATH_ASSSETS + song.filename;
    newSong.duration = parseInt(duration.toFixed());

    return await this.songRepository.save(newSong);
  }

  async findAllByAlbum(albumId: number) {
    const album = await this.albumService.findOne(albumId);
    if (album) {
      return this.songRepository.findBy({ album });
    }

    return [];
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
