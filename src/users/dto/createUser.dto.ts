import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ROLES } from "../../constants/roles"

export class CreateUserDTO {

  @IsNotEmpty()
  @IsString()
  clerkId: string

  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsOptional()
  photo: string

  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES
}