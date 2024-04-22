import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  create(createArtistDto: CreateArtistDto, fileUrl: string) {
    createArtistDto.avatar = fileUrl;
    return this.artistRepository.save(createArtistDto);
  }

  findAll() {
    return this.artistRepository.find();
  }

  findOne(id: number) {
    return this.artistRepository.findOne({ where: { id } });
  }

  async update(id: number, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    const data = Object.assign(artist, updateArtistDto);

    return this.artistRepository.save(data);
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
