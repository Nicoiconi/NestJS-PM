import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BuyerPostsService } from "../services/buyer-posts.service";
import { CreateBuyerPostDTO } from "../dto/createBuyerPost.dto";
import { UpdateBuyerPostDTO } from "../dto/updateBuyerPost.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Buyer Posts")
@Controller("buyer-posts")
export class BuyerPostsController {
  constructor(private readonly buyerPostsService: BuyerPostsService) { }

  @Post("add")
  public async addBuyerPost(@Body() body: CreateBuyerPostDTO) {
    return await this.buyerPostsService.createBuyerPost(body)
  }

  @Get("all")
  public async findAllBuyerPosts() {
    return await this.buyerPostsService.findBuyerPosts()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findBuyerPostById(@Param("id") id: string) {
    return await this.buyerPostsService.findBuyerPostById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateBuyerPost(@Param("id") id: string, @Body() body: UpdateBuyerPostDTO) {
    return await this.buyerPostsService.updateBuyerPost(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id")
  public async deleteBuyerPost(@Param("id") id: string) {
    return await this.buyerPostsService.deleteBuyerPost(id)
  }
}