import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { BaseEntity } from "../../entities/base.entity"
import { ISellerPosts } from "../interfaces/seller-postsInterfaces"
import { CategoriesEntity } from "../../categories/entities/categories.entity"
import { ClientsEntity } from "../../clients/entities/clients.entity"

@Entity("seller-posts")
export class SellerPostsEntity extends BaseEntity implements ISellerPosts {

  @Column()
  price: string

  @Column()
  description: string

  @ManyToOne(() => ClientsEntity, (client) => client)
  @JoinColumn({ name: "client_id" })
  client: ClientsEntity

  @ManyToOne(() => CategoriesEntity, (category) => category)
  @JoinColumn({ name: "category_id" })
  category: CategoriesEntity
}