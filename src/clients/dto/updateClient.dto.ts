import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateClientDTO {

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
  @IsEmail()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  phone: string
}