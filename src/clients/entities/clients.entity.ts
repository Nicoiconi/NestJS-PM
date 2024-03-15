import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../../entities/base.entity"
import { IClient } from "../interfaces/clientInterfaces"
import { BuyerPostsEntity } from "../../buyer-posts/entities/buyer-posts.entity"
import { SellerPostsEntity } from "../../seller-posts/entities/seller-posts.entity"

@Entity("clients")
export class ClientsEntity extends BaseEntity implements IClient {

  @Column({ nullable: true })
  userClerkId: string

  @Column({ nullable: false, unique: true })
  name: string

  @Column()
  description: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @OneToMany(() => BuyerPostsEntity, (buyerPost) => buyerPost.client, { cascade: true })
  buyerPosts: BuyerPostsEntity[]


  @OneToMany(() => SellerPostsEntity, (sellerPost) => sellerPost.client, { cascade: true })
  sellerPosts: SellerPostsEntity[]
}