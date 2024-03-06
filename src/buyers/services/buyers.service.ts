import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BuyersEntity } from "../entities/buyers.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateBuyerDTO } from "../dto/createBuyer.dto";
import { UpdateBuyerDTO } from "../dto/updateBuyer.dto";

@Injectable()
export class BuyersService {

  constructor(
    @InjectRepository(BuyersEntity) private readonly buyerRepository: Repository<BuyersEntity>,
  ) { }

  public async createBuyer(body: CreateBuyerDTO): Promise<BuyersEntity> {
    try {
      return await this.buyerRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findBuyers(): Promise<BuyersEntity[]> {
    try {
      const buyers: BuyersEntity[] = await this.buyerRepository.find()

      if (!buyers) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Buyers failed."
        })
      }

      if (buyers.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no buyers."
        })
      }

      return buyers
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBuyerById(id: string): Promise<BuyersEntity> {
    try {
      const buyer: BuyersEntity = await this.buyerRepository
        .createQueryBuilder("buyer")
        .where({ id })
        .getOne()

      if (!buyer) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Buyer not found."
        })
      }

      return buyer
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateBuyerDTO
    value: any
  }) {
    try {
      const buyer: BuyersEntity = await this.buyerRepository
        .createQueryBuilder("buyer")
        .where({ [key]: value })
        .getOne()

      return buyer
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateBuyer(body: UpdateBuyerDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const buyer: UpdateResult = await this.buyerRepository.update(id, body)

      if (buyer.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Buyers failed."
        })
      }

      return buyer

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteBuyer(id: string): Promise<DeleteResult | undefined> {
    try {
      const buyer: DeleteResult = await this.buyerRepository.delete(id)

      if (buyer.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Buyers failed"
        })
      }

      return buyer

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}