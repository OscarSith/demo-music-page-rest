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
  Query,
  HttpException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PublicRoute } from 'src/public-route/public-route.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const MIME_TYPES = 'jpeg|jpg|png';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/avatar',
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
        .addFileTypeValidator({
          fileType: new RegExp(MIME_TYPES),
        })
        .build(),
    )
    avatar: Express.Multer.File,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    return this.artistsService.create(createArtistDto, avatar.filename);
  }

  @Get('/search-by')
  searchByName(@Query('name') name: string) {
    if (name) {
      return this.artistsService.searchByName(name);
    }

    throw new HttpException('A name param must be send', 401);
  }

  @PublicRoute()
  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/avatar',
        filename(req, file, callback) {
          const newFileName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + '_';
          callback(null, newFileName + file.originalname);
        },
      }),
    }),
  )
  update(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp(MIME_TYPES),
        })
        .build({ fileIsRequired: false }),
    )
    avatar: Express.Multer.File,
    @Param('id')
    id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistsService.update(+id, updateArtistDto, avatar?.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistsService.remove(+id);
  }
}
