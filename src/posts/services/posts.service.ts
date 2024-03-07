import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostsEntity } from "../entities/posts.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreatePostDTO } from "../dto/createPost.dto";
import { UpdatePostDTO } from "../dto/updatePost.dto";

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(PostsEntity) private readonly postRepository: Repository<PostsEntity>,
  ) { }

  public async createPost(body: CreatePostDTO): Promise<PostsEntity> {
    try {
      return await this.postRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findPosts(): Promise<PostsEntity[]> {
    try {
      const posts: PostsEntity[] = await this.postRepository.find({
        relations: ["buyer", "seller", "category"]
    })

      if (!posts) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Posts failed."
        })
      }

      if (posts.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no posts."
        })
      }

      return posts
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findPostById(id: string): Promise<PostsEntity> {
    try {
      const post: PostsEntity = await this.postRepository
        .createQueryBuilder("post")
        .where({ id })
        .leftJoinAndSelect("post.buyer", "buyer")
        .leftJoinAndSelect("post.seller", "seller")
        .leftJoinAndSelect("post.category", "category")
        .getOne()

      if (!post) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Post not found."
        })
      }

      return post
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreatePostDTO
    value: any
  }) {
    try {
      const post: PostsEntity = await this.postRepository
        .createQueryBuilder("post")
        .where({ [key]: value })
        .getOne()

      return post
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updatePost(body: UpdatePostDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const post: UpdateResult = await this.postRepository.update(id, body)

      if (post.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Post failed."
        })
      }

      return post

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deletePost(id: string): Promise<DeleteResult | undefined> {
    try {
      const post: DeleteResult = await this.postRepository.delete(id)

      if (post.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Post failed"
        })
      }

      return post

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}