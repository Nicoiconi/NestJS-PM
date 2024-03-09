import { Column, Entity, ManyToOne, OneToOne, } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { CampaignStatus, ICampaign } from "../interfaces/campaignInterfaces";
import { CategoriesEntity } from "../../categories/entities/categories.entity";
import { ClientsEntity } from "../../clients/entities/clients.entity";
import { MatchesEntity } from "../../matches/entities/matches.entity";

@Entity("campaigns")
export class CampaignsEntity extends BaseEntity implements ICampaign {

  @Column({ type: "enum", enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  status: CampaignStatus

  @Column()
  profit: string
  // should be calculated in the front

  @Column()
  buyerPay: string

  @Column()
  sellerCharge: string

  @Column()
  description: string

  // @ManyToOne(() => ClientsEntity, (buyer) => buyer)
  // buyer: ClientsEntity

  // @ManyToOne(() => ClientsEntity, (seller) => seller)
  // seller: ClientsEntity

  @OneToOne(() => MatchesEntity, (match) => match)
  match: MatchesEntity

  @ManyToOne(() => CategoriesEntity, (category) => category)
  category: CategoriesEntity
}