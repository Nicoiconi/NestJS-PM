import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PostsService } from "../services/posts.service";
import { CreatePostDTO } from "../dto/createPost.dto";
import { UpdatePostDTO } from "../dto/updatePost.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post("add")
  public async addPost(@Body() body: CreatePostDTO) {
    return await this.postsService.createPost(body)
  }

  @Get("all")
  public async findAllPosts() {
    return await this.postsService.findPosts()
  }

  @Get(":id")
  public async findPostById(@Param("id") id: string) {
    return await this.postsService.findPostById(id)
  }

  @Put("edit/:id")
  public async updatePost(@Param("id") id: string, @Body() body: UpdatePostDTO) {
    return await this.postsService.updatePost(body, id)
  }

  @Delete("delete/:id")
  public async deletePost(@Param("id") id: string) {
    return await this.postsService.deletePost(id)
  }
}