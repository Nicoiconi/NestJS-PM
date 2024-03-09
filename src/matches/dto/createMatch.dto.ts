import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"
import { BuyerPostsEntity } from "src/buyer-posts/entities/buyer-posts.entity"
import { CategoriesEntity } from "src/categories/entities/categories.entity"
import { SellerPostsEntity } from "src/seller-posts/entities/seller-posts.entity"

export class CreateMatchDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  profit: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  buyerPost: BuyerPostsEntity

  @ApiProperty()
  @IsNotEmpty()
  sellerPost: SellerPostsEntity

  @ApiProperty()
  @IsNotEmpty()
  category: CategoriesEntity

}