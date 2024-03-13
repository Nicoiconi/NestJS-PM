import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CampaignsService } from "../services/campaigns.service";
import { CreateCampaignDTO } from "../dto/createCampaign.dto";
import { UpdateCampaignDTO } from "../dto/updateCampaign.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { Recreate } from "../interfaces/campaignInterfaces";

@ApiTags("Campaigns")
@Controller("campaigns")
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @Post("add")
  public async addCampaign(@Body() body: CreateCampaignDTO) {
    return await this.campaignsService.createCampaign(body)
  }

  @Get("all")
  public async findAllCampaigns() {
    return await this.campaignsService.findCampaigns()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findCampaignById(@Param("id") id: string) {
    return await this.campaignsService.findCampaignById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateCampaign(@Param("id") id: string, @Body() body: UpdateCampaignDTO) {
    return await this.campaignsService.updateCampaign(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id/:recreate")
  public async deleteCampaign(@Param("id") id: string, @Param("recreate") recreate: Recreate) {
    return await this.campaignsService.deleteCampaign(id, recreate)
  }
}