import { Test, TestingModule } from '@nestjs/testing';
import { BuyerPostsService } from './buyer-posts.service';

describe('BuyersService', () => {
  let service: BuyerPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerPostsService],
    }).compile();

    service = module.get<BuyerPostsService>(BuyerPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
