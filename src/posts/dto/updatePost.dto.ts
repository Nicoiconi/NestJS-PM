import { IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdatePostDTO {

  @IsOptional()
  @IsNumberString()
  price: string


  @IsOptional()
  @IsString()
  description: string
}