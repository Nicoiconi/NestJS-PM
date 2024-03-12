import { Column, Entity, ManyToOne, OneToOne, } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { CampaignStatus, ICampaign } from "../interfaces/campaignInterfaces";
import { CategoriesEntity } from "../../categories/entities/categories.entity";
import { ClientsEntity } from "../../clients/entities/clients.entity";

@Entity("campaigns")
export class CampaignsEntity extends BaseEntity implements ICampaign {

  @Column({ type: "enum", enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  status: CampaignStatus

  @Column()
  profit: string

  @ManyToOne(() => ClientsEntity, (buyer) => buyer)
  buyer: ClientsEntity

  @Column()
  buyerPay: string

  @ManyToOne(() => ClientsEntity, (seller) => seller)
  seller: ClientsEntity

  @Column()
  sellerCharge: string

  @ManyToOne(() => CategoriesEntity, (category) => category)
  category: CategoriesEntity

  @Column()
  description: string
}