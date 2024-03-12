import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator"
import { CategoriesEntity } from "../../categories/entities/categories.entity"
import { ClientsEntity } from "../../clients/entities/clients.entity"

export class CreateBuyerPostDTO {
  
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