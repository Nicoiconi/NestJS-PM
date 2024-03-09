import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"
import { CampaignStatus } from "../interfaces/campaignInterfaces"


// Campaign could change buyer-pay & seller-charge, re-create with take the current information.

export class CreateCampaignDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  status: CampaignStatus

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  profit: string

  // buyer: Client

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  buyerPay: string

  // seller: Client

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  sellerCharge: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

}