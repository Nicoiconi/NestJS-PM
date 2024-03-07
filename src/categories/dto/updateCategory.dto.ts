import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateCategoryDTO {

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string
}