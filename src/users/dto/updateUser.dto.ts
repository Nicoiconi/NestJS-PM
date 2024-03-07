import { IsEnum, IsOptional, IsString } from "class-validator"
import { ROLES } from "../../constants/roles"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDTO {

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty()
  @IsOptional()
  @IsOptional()
  photo: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES
}