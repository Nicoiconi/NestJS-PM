import { IsEnum, IsOptional, IsString } from "class-validator"
import { ROLES } from "../../constants/roles"

export class UpdateUserDTO {

  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  email: string

  @IsOptional()
  @IsString()
  username: string

  @IsOptional()
  @IsOptional()
  photo: string

  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES
}