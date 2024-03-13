import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriesEntity } from "../entities/categories.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateCategoryDTO } from "../dto/createCategory.dto";
import { UpdateCategoryDTO } from "../dto/updateCategory.dto";

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoriesEntity) private readonly categoryRepository: Repository<CategoriesEntity>,
  ) { }

  public async createCategory(body: CreateCategoryDTO): Promise<CategoriesEntity> {
    try {
      return await this.categoryRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findCategories(): Promise<CategoriesEntity[]> {
    try {
      const categories: CategoriesEntity[] = await this.categoryRepository.find()

      if (!categories) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Categories failed."
        })
      }

      if (categories.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no Categories."
        })
      }

      return categories
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findCategoryById(id: string): Promise<CategoriesEntity> {
    try {
      const category: CategoriesEntity = await this.categoryRepository
        .createQueryBuilder("category")
        .where({ id })
        .getOne()

      if (!category) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Category not found."
        })
      }

      return category
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateCategoryDTO
    value: any
  }) {
    try {
      const category: CategoriesEntity = await this.categoryRepository
        .createQueryBuilder("category")
        .where({ [key]: value })
        .getOne()

      return category
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateCategory(body: UpdateCategoryDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const category: UpdateResult = await this.categoryRepository.update(id, body)

      if (category.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Category failed."
        })
      }

      return category

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteCategory(id: string): Promise<DeleteResult | undefined> {
    try {
      const category: DeleteResult = await this.categoryRepository.delete(id)

      if (category.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Category failed"
        })
      }

      return category

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}