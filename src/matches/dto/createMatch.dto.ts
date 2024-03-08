import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateMatchDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  profit: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

}