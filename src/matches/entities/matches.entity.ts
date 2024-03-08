import { Column, Entity, ManyToOne, } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { IMatch } from "../interfaces/matchInterfaces";
import { CategoriesEntity } from "../../categories/entities/categories.entity";
import { SellerPostsEntity } from "../../seller-posts/entities/seller-posts.entity";
import { BuyerPostsEntity } from "../../buyer-posts/entities/buyer-posts.entity";

@Entity("matches")
export class MatchesEntity extends BaseEntity implements IMatch {

  @Column()
  profit: string
  // should be calculated in the front

  @Column()
  description: string

  @ManyToOne(() => BuyerPostsEntity, (buyerPost) => buyerPost)
  buyerPost: BuyerPostsEntity

  @ManyToOne(() => SellerPostsEntity, (sellerPost) => sellerPost)
  sellerPost: SellerPostsEntity

  @ManyToOne(() => CategoriesEntity, (category) => category)
  category: CategoriesEntity
}