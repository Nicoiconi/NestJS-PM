import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateBuyerDTO {

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  phone: string
}