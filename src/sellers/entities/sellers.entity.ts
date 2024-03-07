import { Column, Entity  } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { ISeller } from "../interfaces/sellerInterfaces";

@Entity("sellers")
export class SellersEntity extends BaseEntity implements ISeller {

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
}