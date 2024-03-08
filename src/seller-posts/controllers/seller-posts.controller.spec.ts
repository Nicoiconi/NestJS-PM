import { Test, TestingModule } from '@nestjs/testing';
import { SellerPostsController } from './seller-posts.controller';

describe('SellersController', () => {
  let controller: SellerPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerPostsController],
    }).compile();

    controller = module.get<SellerPostsController>(SellerPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
