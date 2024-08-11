import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PublicRoute } from 'src/public-route/public-route.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const MIME_TYPES = 'jpeg|jpg|png';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './public/albums',
        filename(req, file, callback) {
          const newFileName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + '_';
          callback(null, newFileName + file.originalname);
        },
      }),
    }),
  )
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: MIME_TYPES })
        .build(),
    )
    picture: Express.Multer.File,
    @Body()
    createAlbumDto: CreateAlbumDto,
  ) {
    return this.albumService.create(createAlbumDto, picture.filename);
  }

  @PublicRoute()
  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(+id);
  }

  @PublicRoute()
  @Get('by-artist/:artistId')
  findByArtistId(@Param('artistId') artistId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.albumService.findByArtist(+artistId));
      }, 500);
    });
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './public/albums',
        filename(req, file, callback) {
          const newFileName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + '_';
          callback(null, newFileName + file.originalname);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: MIME_TYPES })
        .build({ fileIsRequired: false }),
    )
    picture: Express.Multer.File,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(+id, updateAlbumDto, picture?.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(+id);
  }
}
