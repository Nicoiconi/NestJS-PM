import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { IClient } from "../interfaces/clientInterfaces";
import { BuyerPostsEntity } from "../../buyer-posts/entities/buyer-posts.entity";
import { SellerPostsEntity } from "../../seller-posts/entities/seller-posts.entity";

@Entity("clients")
export class ClientsEntity extends BaseEntity implements IClient {

  @Column({ nullable: true })
  userClerkId: string

  @Column({ nullable: false })
  name: string

  @Column()
  description: string

  @Column({ nullable: false })
  email: string

  @Column()
  phone: string

  // 1:M buyerPosts
  @OneToMany(() => BuyerPostsEntity, (buyerPost) => buyerPost.client)
  buyerPosts: BuyerPostsEntity[]

  // 1:M purchases


  // 1:M sales
  @OneToMany(() => SellerPostsEntity, (sellerPost) => sellerPost.client)
  sellerPosts: SellerPostsEntity[]

  // 1:M sellerPosts


}