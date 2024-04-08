import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { CreateLibraryDataDto } from './dto/create-library-data.dto';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Post('/favorite')
  favorite(@Body() createLibraryDto: CreateLibraryDto, @Req() req: Request) {
    // req['user'].sub guarda el id del usuario autenticado
    // (Se obtiene del token generado auth.guard.ts)
    return this.librariesService.createfavorite(
      createLibraryDto.songId,
      req['user'].sub,
    );
  }

  @Post()
  create(@Body() createLibraryDto: CreateLibraryDto, @Req() req: Request) {
    return this.librariesService.create(createLibraryDto, req['user'].id);
  }

  @HttpCode(204)
  @Post('/add-data')
  addData(@Body() createLibraryDataDto: CreateLibraryDataDto) {
    return this.librariesService.addDataToLibrary(createLibraryDataDto);
  }

  @Get()
  findAll() {
    return this.librariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.librariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.librariesService.update(+id, updateLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.librariesService.remove(+id);
  }
}
