import { IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateSellerDTO {

  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  email: string

  @IsOptional()
  @IsNumberString()
  phone: string

}