import { Column, Entity  } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { IBuyer } from "../interfaces/buyerInterfaces";

@Entity("buyers")
export class BuyersEntity extends BaseEntity implements IBuyer {

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