import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ClientsService } from "../services/clients.service";
import { CreateClientDTO } from "../dto/createClient.dto";
import { UpdateClientDTO } from "../dto/updateClient.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Clients")
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }


  @Post("add")
  public async addClient(@Body() body: CreateClientDTO) {
    return await this.clientsService.createClient(body)
  }

  @Get("all")
  public async findAllClients() {
    return await this.clientsService.findClients()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findClientById(@Param("id") id: string) {
    return await this.clientsService.findClientById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateClient(@Param("id") id: string, @Body() body: UpdateClientDTO) {
    return await this.clientsService.updateClient(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id")
  public async deleteClient(@Param("id") id: string) {
    return await this.clientsService.deleteClient(id)
  }
}