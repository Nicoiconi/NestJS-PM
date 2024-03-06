import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ROLES } from "../../constants/roles"

export class UpdateUserDTO {

  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @IsNumber()
  age: number

  @IsOptional()
  @IsString()
  email: string

  @IsOptional()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  password: string

  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES
}