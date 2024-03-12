import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"
import { CategoriesEntity } from "../../categories/entities/categories.entity"
import { ClientsEntity } from "../../clients/entities/clients.entity"

export class CreateSellerPostDTO {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  client: ClientsEntity

  @ApiProperty()
  @IsNotEmpty()
  category: CategoriesEntity
}