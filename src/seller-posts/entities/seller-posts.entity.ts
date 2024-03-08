import { Column, Entity, ManyToOne  } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { ISellerPosts } from "../interfaces/seller-postsInterfaces";
import { CategoriesEntity } from "../../categories/entities/categories.entity";
import { ClientsEntity } from "../../clients/entities/clients.entity";

@Entity("seller-posts")
export class SellerPostsEntity extends BaseEntity implements ISellerPosts {

  @Column()
  price: string

  @Column()
  description: string

  // @ManyToOne(() => ClientsEntity, (client) => client.sellerPosts)
  @ManyToOne(() => ClientsEntity, (client) => client)
  client: ClientsEntity

  @ManyToOne(() => CategoriesEntity, (category) => category)
  category: CategoriesEntity
}