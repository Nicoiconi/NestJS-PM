import { Test, TestingModule } from '@nestjs/testing';
import { SellerPostsService } from './seller-posts.service';

describe('BuyersService', () => {
  let service: SellerPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerPostsService],
    }).compile();

    service = module.get<SellerPostsService>(SellerPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
