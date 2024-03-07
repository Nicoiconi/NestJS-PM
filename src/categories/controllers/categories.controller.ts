import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { CreateCategoryDTO } from "../dto/createCategory.dto";
import { UpdateCategoryDTO } from "../dto/updateCategory.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post("add")
  public async addCategory(@Body() body: CreateCategoryDTO) {
    return await this.categoriesService.createCategory(body)
  }

  @Get("all")
  public async findAllCategoriers() {
    return await this.categoriesService.findCategories()
  }

  @Get(":id")
  public async findCategoryById(@Param("id") id: string) {
    return await this.categoriesService.findCategoryById(id)
  }

  @Put("edit/:id")
  public async updateCategory(@Param("id") id: string, @Body() body: UpdateCategoryDTO) {
    return await this.categoriesService.updateCategory(body, id)
  }

  @Delete("delete/:id")
  public async deleteCategory(@Param("id") id: string) {
    return await this.categoriesService.deleteCategory(id)
  }
}