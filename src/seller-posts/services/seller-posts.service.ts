import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SellerPostsEntity } from "../entities/seller-posts.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateSellerPostDTO } from "../dto/createSellerPost.dto";
import { UpdateSellerPostDTO } from "../dto/updateSellerPost.dto";

@Injectable()
export class SellerPostsService {

  constructor(
    @InjectRepository(SellerPostsEntity) private readonly sellerPostRepository: Repository<SellerPostsEntity>,
  ) { }

  public async createSellerPost(body: CreateSellerPostDTO): Promise<SellerPostsEntity> {
    try {

      const sellerPost: SellerPostsEntity = await this.sellerPostRepository
        .createQueryBuilder("seller-post")
        .where(body)
        .getOne()

      if (sellerPost) {
        throw new ErrorManager({
          type: "CONFLICT",
          message: "There is already a seller post with that information."
        })
      }

      return await this.sellerPostRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findSellerPosts(): Promise<SellerPostsEntity[]> {
    try {
      const sellerPosts: SellerPostsEntity[] = await this.sellerPostRepository.find()

      if (!sellerPosts) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Seller Posts failed."
        })
      }

      if (sellerPosts.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no Seller Posts."
        })
      }

      return sellerPosts
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findSellerPostById(id: string): Promise<SellerPostsEntity> {
    try {
      const sellerPost: SellerPostsEntity = await this.sellerPostRepository
        .createQueryBuilder("seller-post")
        .where({ id })
        .leftJoinAndSelect("seller-post.client", "client")
        .leftJoinAndSelect("seller-post.category", "category")
        .getOne()

      if (!sellerPost) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Seller Post not found."
        })
      }

      return sellerPost
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateSellerPostDTO
    value: any
  }) {
    try {
      const sellerPost: SellerPostsEntity = await this.sellerPostRepository
        .createQueryBuilder("seller-post")
        .where({ [key]: value })
        .getOne()

      return sellerPost
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateSellerPost(body: UpdateSellerPostDTO, id: string): Promise<UpdateResult | undefined> {
    try {

      const existingSellerPost: SellerPostsEntity = await this.sellerPostRepository
        .createQueryBuilder("seller-post")
        .where(body)
        .getOne()

      if (existingSellerPost) {
        throw new ErrorManager({
          type: "CONFLICT",
          message: "There is already a seller post with that information."
        })
      }

      const sellerPost: UpdateResult = await this.sellerPostRepository.update(id, body)

      if (sellerPost.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Seller Post failed."
        })
      }

      return sellerPost

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteSellerPost(id: string): Promise<DeleteResult | undefined> {
    try {
      const sellerPost: DeleteResult = await this.sellerPostRepository.delete(id)

      if (sellerPost.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Seller Post failed"
        })
      }

      return sellerPost

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}