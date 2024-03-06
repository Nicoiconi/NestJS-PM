import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateBuyerDTO {

  @IsOptional()
  @IsString()
  userClerkId: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @IsNumberString()
  phone: string
}