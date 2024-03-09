import { ApiProperty } from "@nestjs/swagger"
import { IsNumberString, IsString } from "class-validator"

export class UpdateCampaignDTO {

  @ApiProperty()
  @IsNumberString()
  profit: string

  @ApiProperty()
  @IsNumberString()
  buyerPay: string

  @ApiProperty()
  @IsNumberString()
  sellerCharge: string

  @ApiProperty()
  @IsString()
  description: string
}