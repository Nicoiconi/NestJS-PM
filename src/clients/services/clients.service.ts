import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientsEntity } from "../entities/clients.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateClientDTO } from "../dto/createClient.dto";
import { UpdateClientDTO } from "../dto/updateClient.dto";

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(ClientsEntity) private readonly clientRepository: Repository<ClientsEntity>,
  ) { }

  public async createClient(body: CreateClientDTO): Promise<ClientsEntity> {
    try {
      return await this.clientRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAllClients(): Promise<ClientsEntity[]> {
    try {
      const clients: ClientsEntity[] = await this.clientRepository.find()

      if (!clients) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Clients failed."
        })
      }

      if (clients.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no clients."
        })
      }

      return clients
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findClientById(id: string): Promise<ClientsEntity> {
    try {
      const client: ClientsEntity = await this.clientRepository
        .createQueryBuilder("client")
        .where({ id })
        .getOne()

      if (!client) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Client not found."
        })
      }

      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findClientBy({ key, value }: {
    key: keyof CreateClientDTO
    value: any
  }) {
    try {
      const client: ClientsEntity = await this.clientRepository
        .createQueryBuilder("client")
        .where({ [key]: value })
        .getOne()

      return client
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateClient(body: UpdateClientDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const client: UpdateResult = await this.clientRepository.update(id, body)

      if (client.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Clients failed."
        })
      }

      return client

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteClient(id: string): Promise<DeleteResult | undefined> {
    try {
      const client: DeleteResult = await this.clientRepository.delete(id)

      if (client.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Client failed"
        })
      }

      return client

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}