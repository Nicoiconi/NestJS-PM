import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { SellerPostsService } from "../services/seller-posts.service";
import { CreateSellerPostDTO } from "../dto/createSellerPost.dto";
import { UpdateSellerPostDTO } from "../dto/updateSellerPost.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Seller Posts")
@Controller("seller-posts")
export class SellerPostsController {
  constructor(private readonly sellerPostsService: SellerPostsService) { }

  @Post("add")
  public async addSellerPost(@Body() body: CreateSellerPostDTO) {
    return await this.sellerPostsService.createSellerPost(body)
  }

  @Get("all")
  public async findAllSellerPosts() {
    return await this.sellerPostsService.findSellerPosts()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findSellerPostById(@Param("id") id: string) {
    return await this.sellerPostsService.findSellerPostById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateSellerPost(@Param("id") id: string, @Body() body: UpdateSellerPostDTO) {
    return await this.sellerPostsService.updateSellerPost(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id")
  public async deleteSellerPost(@Param("id") id: string) {
    return await this.sellerPostsService.deleteSellerPost(id)
  }
}