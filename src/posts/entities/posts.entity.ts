import { Column, Entity, ManyToOne, } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { IPost } from "../interfaces/postInterfaces";
import { BuyersEntity } from "../../buyers/entities/buyers.entity";
import { SellersEntity } from "../../sellers/entities/sellers.entity";
import { CategoriesEntity } from "../../categories/entities/categories.entity";

@Entity("posts")
export class PostsEntity extends BaseEntity implements IPost {

  @Column()
  price: string

  @Column()
  description: string

  @ManyToOne(() => BuyersEntity, (buyer) => buyer)
  buyer: BuyersEntity

  @ManyToOne(() => SellersEntity, (seller) => seller)
  seller: SellersEntity

  @ManyToOne(() => CategoriesEntity, (category) => category)
  category: CategoriesEntity
}