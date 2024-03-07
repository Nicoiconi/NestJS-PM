import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreatePostDTO {

  @IsNotEmpty()
  @IsNumberString()
  price: string

  @IsOptional()
  @IsString()
  description: string

}