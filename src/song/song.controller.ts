import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('song', {
      storage: diskStorage({
        destination: './public/songs',
        filename(req, file, callback) {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'audio/mpeg' })
        .build(),
    )
    song: Express.Multer.File,
    @Body()
    createSongDto: CreateSongDto,
  ) {
    return this.songService.create(createSongDto, song);
  }

  @Get(':albumId/albums')
  findAll(@Param('albumId') albumId: string) {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(this.songService.findAllByAlbum(+albumId)),
        1000,
      );
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(+id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(+id);
  }
}
