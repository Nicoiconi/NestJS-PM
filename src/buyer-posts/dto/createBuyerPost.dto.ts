import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateBuyerPostDTO {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

}