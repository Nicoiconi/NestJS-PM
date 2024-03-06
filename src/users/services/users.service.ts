import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "../entities/users.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateUserDTO } from "../dto/createUser.dto";
import { UpdateUserDTO } from "../dto/updateUser.dto";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
  ) { }

  public async createUser(body: CreateUserDTO): Promise<UsersEntity> {
    try {
      return await this.userRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUsers(): Promise<UsersEntity[]> {
    try {
      const users: UsersEntity[] = await this.userRepository.find()

      if (!users) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Users failed."
        })
      }

      if (users.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no users."
        })
      }

      return users
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder("user")
        .where({ id })
        .getOne()

      if (!user) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "User not found."
        })
      }

      return user
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateUserDTO
    value: any
  }) {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder("user")
        // .addSelect("user.password")
        .where({ [key]: value })
        .getOne()

      return user
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateUser(body: UpdateUserDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const user: UpdateResult = await this.userRepository.update(id, body)

      if (user.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Users failed."
        })
      }

      return user

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id)

      if (user.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Users failed"
        })
      }

      return user

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}