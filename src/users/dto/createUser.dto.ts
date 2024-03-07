import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ROLES } from "../../constants/roles"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clerkId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  photo: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES
}