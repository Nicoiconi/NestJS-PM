import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { MatchesService } from "../services/matches.service";
import { CreateMatchDTO } from "../dto/createMatch.dto";
import { UpdateMatchDTO } from "../dto/updateMatch.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Matches")
@Controller("matches")
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) { }

  @Post("add")
  public async addMatch(@Body() body: CreateMatchDTO) {
    return await this.matchesService.createMatch(body)
  }

  @Get("all")
  public async findAllMatches() {
    return await this.matchesService.findMatches()
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  public async findMatchById(@Param("id") id: string) {
    return await this.matchesService.findMatchById(id)
  }

  @ApiParam({ name: "id" })
  @Put("edit/:id")
  public async updateMatch(@Param("id") id: string, @Body() body: UpdateMatchDTO) {
    return await this.matchesService.updateMatch(body, id)
  }

  @ApiParam({ name: "id" })
  @Delete("delete/:id")
  public async deleteMatch(@Param("id") id: string) {
    return await this.matchesService.deleteMatch(id)
  }
}