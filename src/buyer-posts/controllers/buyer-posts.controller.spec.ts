import { Test, TestingModule } from '@nestjs/testing';
import { BuyersPostsController } from './buyer-posts.controller';

describe('BuyersController', () => {
  let controller: BuyersPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyersPostsController],
    }).compile();

    controller = module.get<BuyersPostsController>(BuyersPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
