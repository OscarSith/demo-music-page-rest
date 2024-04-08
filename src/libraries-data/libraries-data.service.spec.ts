import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesDataService } from './libraries-data.service';

describe('LibrariesDataService', () => {
  let service: LibrariesDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibrariesDataService],
    }).compile();

    service = module.get<LibrariesDataService>(LibrariesDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
