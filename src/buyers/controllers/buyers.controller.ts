import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BuyersService } from "../services/buyers.service";
import { CreateBuyerDTO } from "../dto/createBuyer.dto";
import { UpdateBuyerDTO } from "../dto/updateBuyer.dto";

@Controller("buyers")
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) { }

  @Post("add")
  public async addBuyer(@Body() body: CreateBuyerDTO) {
    return await this.buyersService.createBuyer(body)
  }

  @Get("all")
  public async findAllBuyers() {
    return await this.buyersService.findBuyers()
  }

  @Get(":id")
  public async findBuyerById(@Param("id") id: string) {
    return await this.buyersService.findBuyerById(id)
  }

  @Put("edit/:id")
  public async updateBuyer(@Param("id") id: string, @Body() body: UpdateBuyerDTO) {
    return await this.buyersService.updateBuyer(body, id)
  }

  @Delete("delete/:id")
  public async deleteBuyer(@Param("id") id: string) {
    return await this.buyersService.deleteBuyer(id)
  }
}