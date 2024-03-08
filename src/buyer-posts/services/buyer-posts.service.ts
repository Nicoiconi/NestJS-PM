import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BuyerPostsEntity } from "../entities/buyer-posts.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateBuyerPostDTO } from "../dto/createBuyerPost.dto";
import { UpdateBuyerPostDTO } from "../dto/updateBuyerPost.dto";

@Injectable()
export class BuyerPostsService {

  constructor(
    @InjectRepository(BuyerPostsEntity) private readonly buyerPostRepository: Repository<BuyerPostsEntity>,
  ) { }

  public async createBuyerPost(body: CreateBuyerPostDTO): Promise<BuyerPostsEntity> {
    try {
      return await this.buyerPostRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findBuyerPosts(): Promise<BuyerPostsEntity[]> {
    try {
      const buyerPosts: BuyerPostsEntity[] = await this.buyerPostRepository.find()

      if (!buyerPosts) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Buyer Posts failed."
        })
      }

      if (buyerPosts.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no Buyer Posts."
        })
      }

      return buyerPosts
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBuyerPostById(id: string): Promise<BuyerPostsEntity> {
    try {
      const buyerPost: BuyerPostsEntity = await this.buyerPostRepository
        .createQueryBuilder("buyer-post")
        .where({ id })
        .leftJoinAndSelect("buyer-post.client", "client")
        .leftJoinAndSelect("buyer-post.category", "category")
        .getOne()

      if (!buyerPost) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Buyer Post not found."
        })
      }

      return buyerPost
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateBuyerPostDTO
    value: any
  }) {
    try {
      const buyerPost: BuyerPostsEntity = await this.buyerPostRepository
        .createQueryBuilder("buyer-post")
        .where({ [key]: value })
        .getOne()

      return buyerPost
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateBuyerPost(body: UpdateBuyerPostDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const buyerPost: UpdateResult = await this.buyerPostRepository.update(id, body)

      if (buyerPost.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Buyer Post failed."
        })
      }

      return buyerPost

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteBuyerPost(id: string): Promise<DeleteResult | undefined> {
    try {
      const buyerPost: DeleteResult = await this.buyerPostRepository.delete(id)

      if (buyerPost.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Buyer Post failed"
        })
      }

      return buyerPost

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}