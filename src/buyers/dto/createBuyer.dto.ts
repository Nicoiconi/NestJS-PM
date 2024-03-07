import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateBuyerDTO {
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  userClerkId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  phone: string
}