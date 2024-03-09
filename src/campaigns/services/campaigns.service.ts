import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CampaignsEntity } from "../entities/campaigns.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { UpdateCampaignDTO } from "../dto/updateCampaign.dto";
import { CreateCampaignDTO } from "../dto/createCampaign.dto";
import { Recreate } from "../interfaces/campaignInterfaces";
import { BuyerPostsEntity } from "../../buyer-posts/entities/buyer-posts.entity";
import { SellerPostsEntity } from "../../seller-posts/entities/seller-posts.entity";
import { MatchesEntity } from "../../matches/entities/matches.entity";

@Injectable()
export class CampaignsService {

  constructor(
    @InjectRepository(CampaignsEntity)
    private readonly campaignRepository: Repository<CampaignsEntity>,
    @InjectRepository(BuyerPostsEntity)
    private readonly buyerPostsRepository: Repository<BuyerPostsEntity>,
    @InjectRepository(SellerPostsEntity)
    private readonly sellerPostsRepository: Repository<SellerPostsEntity>,
    @InjectRepository(MatchesEntity)
    private readonly matchPostsRepository: Repository<MatchesEntity>,
  ) { }

  public async createCampaign(body: CreateCampaignDTO): Promise<CampaignsEntity> {
    try {
      return await this.campaignRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findCampaigns(): Promise<CampaignsEntity[]> {
    try {
      const campaignes: CampaignsEntity[] = await this.campaignRepository.find({
        relations: ["match", "category"]
      })

      if (!campaignes) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Campaigns failed."
        })
      }

      if (campaignes.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no campaignes."
        })
      }

      return campaignes
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findCampaignById(id: string): Promise<CampaignsEntity> {
    try {
      const campaign: CampaignsEntity = await this.campaignRepository
        .createQueryBuilder("campaign")
        .where({ id })
        .leftJoinAndSelect("campaign.match", "match")
        .leftJoinAndSelect("campaign.category", "category")
        .getOne()

      if (!campaign) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Campaign not found."
        })
      }

      return campaign
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateCampaignDTO
    value: any
  }) {
    try {
      const campaign: CampaignsEntity = await this.campaignRepository
        .createQueryBuilder("campaign")
        .where({ [key]: value })
        .getOne()

      return campaign
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateCampaign(body: UpdateCampaignDTO, id: string): Promise<UpdateResult | undefined> {
    try {

      const campaignToDelete: CampaignsEntity = await this.campaignRepository
        .createQueryBuilder("campaign")
        .where({ id })
        .getOne()

      if (!campaignToDelete) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Campaign not found."
        })
      }

      if (body.buyerPay && body.sellerCharge) {
        body.profit = (+body.sellerCharge - +body.buyerPay).toString()
      }

      if (body.buyerPay && !body.sellerCharge) {
        body.profit = (+campaignToDelete.sellerCharge - +body.buyerPay).toString()
      }

      if (body.sellerCharge && !body.buyerPay) {
        body.profit = (+body.sellerCharge - +campaignToDelete.buyerPay).toString()
      }

      const campaign: UpdateResult = await this.campaignRepository.update(id, body)

      if (campaign.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Campaign failed."
        })
      }

      return campaign

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteCampaign(id: string, recreate?: Recreate): Promise<DeleteResult | undefined> {
    try {

      const campaignToDelete: CampaignsEntity = await this.campaignRepository
        .createQueryBuilder("campaign")
        .where({ id })
        .getOne()

      if (!campaignToDelete) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Campaign not found."
        })
      }

      const campaign: DeleteResult = await this.campaignRepository.delete(id)

      if (campaign.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Campaign failed."
        })
      }

      // let buyerPostRecreated: BuyerPostsEntity,
      //   sellerPostRecreated: SellerPostsEntity

      // if (recreate && recreate === Recreate.POSTS) {
      //   buyerPostRecreated = await this.buyerPostsRepository.save({
      //     client: campaignToDelete.buyer,
      //     category: campaignToDelete.category,
      //     price: campaignToDelete.buyerPay,
      //     description: ""
      //   })

      //   sellerPostRecreated = await this.sellerPostsRepository.save({
      //     client: campaignToDelete.buyer,
      //     category: campaignToDelete.category,
      //     price: campaignToDelete.buyerPay,
      //     description: ""
      //   })
      // }

      // if (recreate && recreate === Recreate.MATCH) {
      //   const matchProfit = +sellerPostRecreated.price - +buyerPostRecreated.price
      //   await this.matchPostsRepository.save({
      //     profit: matchProfit.toString(),
      //     description: "",
      //     buyerPost: buyerPostRecreated,
      //     sellerPost: sellerPostRecreated,
      //     category: campaignToDelete.category,
      //   })
      // }

      // if (recreate && recreate === Recreate.BUYER_POST) {
      //   buyerPostRecreated = await this.buyerPostsRepository.save({
      //     client: campaignToDelete.buyer,
      //     category: campaignToDelete.category,
      //     price: campaignToDelete.buyerPay,
      //     description: ""
      //   })
      // }

      // if (recreate && recreate === Recreate.SELLER_POST) {
      //   sellerPostRecreated = await this.sellerPostsRepository.save({
      //     client: campaignToDelete.buyer,
      //     category: campaignToDelete.category,
      //     price: campaignToDelete.buyerPay,
      //     description: ""
      //   })
      // }

      return campaign

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}