import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateSellerPostDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

}