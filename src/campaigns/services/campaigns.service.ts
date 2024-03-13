import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CampaignsEntity } from "../entities/campaigns.entity";
import { DeepPartial, DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { UpdateCampaignDTO } from "../dto/updateCampaign.dto";
import { CreateCampaignDTO } from "../dto/createCampaign.dto";
import { CampaignToCreate, Recreate } from "../interfaces/campaignInterfaces";
import { BuyerPostsEntity } from "../../buyer-posts/entities/buyer-posts.entity";
import { SellerPostsEntity } from "../../seller-posts/entities/seller-posts.entity";
import { MatchesEntity } from "../../matches/entities/matches.entity";
import { ClientsEntity } from "src/clients/entities/clients.entity";

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
    private readonly matchesRepository: Repository<MatchesEntity>,
  ) { }

  public async createCampaign(body: CreateCampaignDTO): Promise<CampaignsEntity> {
    try {

      const { match, description } = body

      const matchToDelete = await this.matchesRepository.createQueryBuilder("match")
        .where({ id: match })
        .leftJoinAndSelect("match.buyerPost", "buyerPost")
        .leftJoinAndSelect("buyerPost.client", "buyerClient")
        .leftJoinAndSelect("match.sellerPost", "sellerPost")
        .leftJoinAndSelect("sellerPost.client", "sellerClient")
        .leftJoinAndSelect("match.category", "category")
        .getOne()

      if (!matchToDelete) {
        throw new ErrorManager({
          type: "CONFLICT",
          message: "Match not found."
        })
      }

      const createdCampaign = await this.campaignRepository.save({
        profit: matchToDelete.profit,
        buyer: matchToDelete.buyerPost.client,
        buyerPay: matchToDelete.buyerPost.price,
        seller: matchToDelete.sellerPost.client,
        sellerCharge: matchToDelete.sellerPost.price,
        category: matchToDelete.category,
        description
      })

      if (!createdCampaign) {
        throw new ErrorManager({
          type: "CONFLICT",
          message: "Campaign not created."
        })
      }

      await this.matchesRepository.delete(match)
      await this.buyerPostsRepository.delete(matchToDelete.buyerPost.id)
      await this.sellerPostsRepository.delete(matchToDelete.sellerPost.id)

      return createdCampaign
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findCampaigns(): Promise<CampaignsEntity[]> {
    try {
      const campaignes: CampaignsEntity[] = await this.campaignRepository.find({
        relations: ["category", "buyer", "seller"]
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
        // .leftJoinAndSelect("campaign.match", "match")
        .leftJoinAndSelect("campaign.buyer", "buyerClient")
        .leftJoinAndSelect("campaign.seller", "sellerClient")
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
        body.profit = (+body.buyerPay - +body.sellerCharge).toString()
      }

      if (body.buyerPay && !body.sellerCharge) {
        body.profit = (+campaignToDelete.buyerPay - +body.sellerCharge).toString()
      }

      if (body.sellerCharge && !body.buyerPay) {
        body.profit = (+body.buyerPay - +campaignToDelete.sellerCharge).toString()
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

      let buyerPostRecreated: BuyerPostsEntity,
        sellerPostRecreated: SellerPostsEntity

      if (recreate && recreate === Recreate.POSTS) {
        buyerPostRecreated = await this.buyerPostsRepository.save({
          client: campaignToDelete.buyer,
          category: campaignToDelete.category,
          price: campaignToDelete.buyerPay,
          description: ""
        })

        sellerPostRecreated = await this.sellerPostsRepository.save({
          client: campaignToDelete.buyer,
          category: campaignToDelete.category,
          price: campaignToDelete.buyerPay,
          description: ""
        })
      }

      if (recreate && recreate === Recreate.MATCH) {
        buyerPostRecreated = await this.buyerPostsRepository.save({
          client: campaignToDelete.buyer,
          category: campaignToDelete.category,
          price: campaignToDelete.buyerPay,
          description: ""
        })

        sellerPostRecreated = await this.sellerPostsRepository.save({
          client: campaignToDelete.buyer,
          category: campaignToDelete.category,
          price: campaignToDelete.buyerPay,
          description: ""
        })

        const matchProfit = +sellerPostRecreated.price - +buyerPostRecreated.price
        await this.matchesRepository.save({
          profit: matchProfit.toString(),
          description: "",
          buyerPost: buyerPostRecreated,
          sellerPost: sellerPostRecreated,
          category: campaignToDelete.category,
        })
      }

      if (recreate && recreate === Recreate.BUYER_POST) {
        buyerPostRecreated = await this.buyerPostsRepository.save({
          client: campaignToDelete.buyer,
          category: campaignToDelete.category,
          price: campaignToDelete.buyerPay,
          description: ""
        })
      }

      if (recreate && recreate === Recreate.SELLER_POST) {
        sellerPostRecreated = await this.sellerPostsRepository.save({
          client: campaignToDelete.buyer,
          category: campaignToDelete.category,
          price: campaignToDelete.buyerPay,
          description: ""
        })
      }

      return campaign

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}