import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateCampaignDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  match: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  profit: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string
}