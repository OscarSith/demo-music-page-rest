import { Controller } from '@nestjs/common';
import { LibrariesDataService } from './libraries-data.service';

@Controller('libraries-data')
export class LibrariesDataController {
  constructor(private readonly librariesDataService: LibrariesDataService) {}
}
