import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { BaseEntity } from "../../entities/base.entity"
import { IBuyerPosts } from "../interfaces/buyer-postsInterfaces"
import { CategoriesEntity } from "../../categories/entities/categories.entity"
import { ClientsEntity } from "../../clients/entities/clients.entity"

@Entity("buyer-posts")
export class BuyerPostsEntity extends BaseEntity implements IBuyerPosts {

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