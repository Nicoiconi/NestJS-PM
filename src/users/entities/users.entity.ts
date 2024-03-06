import { Column, Entity,  } from "typeorm";
import { ROLES } from "../../constants/roles";
import { IUser } from "../interfaces/userInterfaces";
import { BaseEntity } from "../../entities/base.entity";
import { IsOptional } from "class-validator";

@Entity("users")
export class UsersEntity extends BaseEntity implements IUser {

  @Column({ unique: true, nullable: false })
  clerkId: string

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ unique: true, nullable: false })
  username: string
  
  @Column()
  photo: string

  @Column({ type: "enum", enum: ROLES })
  role: ROLES

  // @Column({ unique: true, nullable: false })
  // username: string

  // @Exclude()
  // @Column({ nullable: false })
  // password: string

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10)
  // }
}