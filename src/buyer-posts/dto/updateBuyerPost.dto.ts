import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator"
import { CategoriesEntity } from "../../categories/entities/categories.entity"
import { ClientsEntity } from "../../clients/entities/clients.entity"

export class UpdateBuyerPostDTO {

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  price: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty()
  @IsOptional()
  client: ClientsEntity

  @ApiProperty()
  @IsOptional()
  category: CategoriesEntity

}