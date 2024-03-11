import { Column, Entity,  } from "typeorm";
import { BaseEntity } from "../../entities/base.entity";
import { ICategory } from "../interfaces/categoryInterfaces";

@Entity("categories")
export class CategoriesEntity extends BaseEntity implements ICategory {

  @Column({ nullable: false, unique: true })
  name: string

  @Column()
  description: string
}