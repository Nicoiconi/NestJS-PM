import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateCategoryDTO {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

}