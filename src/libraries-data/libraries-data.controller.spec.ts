import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesDataController } from './libraries-data.controller';
import { LibrariesDataService } from './libraries-data.service';

describe('LibrariesDataController', () => {
  let controller: LibrariesDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrariesDataController],
      providers: [LibrariesDataService],
    }).compile();

    controller = module.get<LibrariesDataController>(LibrariesDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
