import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateCategoryDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

}