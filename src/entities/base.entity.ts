import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({default: true})
  is_active: boolean

  @Column({default: false})
  disabled: boolean

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at"
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at"
  })
  updated_at: Date
}