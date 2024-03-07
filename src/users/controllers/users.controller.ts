import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { CreateUserDTO } from "../dto/createUser.dto";
import { UpdateUserDTO } from "../dto/updateUser.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("add")
  public async addUser(@Body() body: CreateUserDTO) {
    return await this.usersService.createUser(body)
  }

  @Get("all")
  public async findAllUsers() {
    return await this.usersService.findUsers()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findUserById(@Param("id") id: string) {
    return await this.usersService.findUserById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateUser(@Param("id") id: string, @Body() body: UpdateUserDTO) {
    return await this.usersService.updateUser(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id")
  public async deleteUser(@Param("id") id: string) {
    return await this.usersService.deleteUser(id)
  }
}