import { HttpException, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';

@Injectable()
export class ArtistsService {
  private PATH_ASSSETS = 'assets/avatar/';

  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto, filename: string) {
    createArtistDto.avatar = this.PATH_ASSSETS + filename;
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

  async update(id: number, updateArtistDto: UpdateArtistDto, avatar: string) {
    const artist = await this.findOne(id);

    // this is for remove the old image only if it any file uploaded
    if (avatar) {
      updateArtistDto.avatar = this.PATH_ASSSETS + avatar;
      try {
        await unlink(this.changeUrlImagePath(artist.avatar));
      } catch (error) {
        console.log(error);
        throw new HttpException(
          `No se pudo eliminar la imagen anterior "${updateArtistDto.name}"`,
          500,
        );
      }
    }

    const data = Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(data);
  }

  async remove(id: number) {
    const artist = await this.findOne(id);
    if (artist) {
      try {
        await unlink(this.changeUrlImagePath(artist.avatar));
      } catch (error) {
        throw new HttpException(
          'Ocurrió un error al intentar eliminar el archivo',
          500,
        );
      }
      return this.artistRepository.delete({ id });
    }

    throw new HttpException('No se pudo borrar el artista', 404);
  }

  /**
   * Cambia la ruta /assets/avatar/......jpg por /public/avatar/....jpg
   * la ruta original en el sistema está en public/avatar
   * @param urlPath ruta de la imagen
   * @returns string nueva ruta de la imagen
   */
  private changeUrlImagePath(urlPath: string): string {
    return urlPath.replace('assets', 'public');
  }
}
