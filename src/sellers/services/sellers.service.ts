import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SellersEntity } from "../entities/sellers.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateSellerDTO } from "../dto/createSeller.dto";
import { UpdateSellerDTO } from "../dto/updateSeller.dto";

@Injectable()
export class SellersService {

  constructor(
    @InjectRepository(SellersEntity) private readonly sellerRepository: Repository<SellersEntity>,
  ) { }

  public async createSeller(body: CreateSellerDTO): Promise<SellersEntity> {
    try {
      return await this.sellerRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findSellers(): Promise<SellersEntity[]> {
    try {
      const sellers: SellersEntity[] = await this.sellerRepository.find()

      if (!sellers) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Sellers failed."
        })
      }

      if (sellers.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no sellers."
        })
      }

      return sellers
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findSellerById(id: string): Promise<SellersEntity> {
    try {
      const seller: SellersEntity = await this.sellerRepository
        .createQueryBuilder("seller")
        .where({ id })
        .getOne()

      if (!seller) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Seller not found."
        })
      }

      return seller
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateSellerDTO
    value: any
  }) {
    try {
      const seller: SellersEntity = await this.sellerRepository
        .createQueryBuilder("seller")
        .where({ [key]: value })
        .getOne()

      return seller
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateSeller(body: UpdateSellerDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const seller: UpdateResult = await this.sellerRepository.update(id, body)

      if (seller.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Sellers failed."
        })
      }

      return seller

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteSeller(id: string): Promise<DeleteResult | undefined> {
    try {
      const seller: DeleteResult = await this.sellerRepository.delete(id)

      if (seller.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Sellers failed"
        })
      }

      return seller

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}