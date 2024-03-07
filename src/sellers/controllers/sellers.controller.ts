import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { SellersService } from "../services/sellers.service";
import { CreateSellerDTO } from "../dto/createSeller.dto";
import { UpdateSellerDTO } from "../dto/updateSeller.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Sellers")
@Controller("sellers")
export class SellersController {
  constructor(private readonly sellersService: SellersService) { }

  @Post("add")
  public async addSeller(@Body() body: CreateSellerDTO) {
    return await this.sellersService.createSeller(body)
  }

  @Get("all")
  public async findAllSellers() {
    return await this.sellersService.findSellers()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findSellerById(@Param("id") id: string) {
    return await this.sellersService.findSellerById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateSeller(@Param("id") id: string, @Body() body: UpdateSellerDTO) {
    return await this.sellersService.updateSeller(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id")
  public async deleteSeller(@Param("id") id: string) {
    return await this.sellersService.deleteSeller(id)
  }
}