import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdatePostDTO {

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  price: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string
}