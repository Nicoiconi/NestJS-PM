import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchesEntity } from "../entities/matches.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ErrorManager } from "../../utils/error.manager";
import { CreateMatchDTO } from "../dto/createMatch.dto";
import { UpdateMatchDTO } from "../dto/updateMatch.dto";

@Injectable()
export class MatchesService {

  constructor(
    @InjectRepository(MatchesEntity) private readonly matchRepository: Repository<MatchesEntity>,
  ) { }

  public async createMatch(body: CreateMatchDTO): Promise<MatchesEntity> {
    try {
      return await this.matchRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findMatches(): Promise<MatchesEntity[]> {
    try {
      const matches: MatchesEntity[] = await this.matchRepository.find({
        relations: ["buyerPost", "sellerPost", "category"]
    })

      if (!matches) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Get Matches failed."
        })
      }

      if (matches.length === 0) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "There are no matches."
        })
      }

      return matches
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findMatchById(id: string): Promise<MatchesEntity> {
    try {
      const match: MatchesEntity = await this.matchRepository
        .createQueryBuilder("match")
        .where({ id })
        .leftJoinAndSelect("match.buyerPost", "buyerPost")
        .leftJoinAndSelect("match.sellerPost", "sellerPost")
        .leftJoinAndSelect("match.category", "category")
        .getOne()

      if (!match) {
        throw new ErrorManager({
          type: "NOT_FOUND",
          message: "Match not found."
        })
      }

      return match
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async findBy({ key, value }: {
    key: keyof CreateMatchDTO
    value: any
  }) {
    try {
      const match: MatchesEntity = await this.matchRepository
        .createQueryBuilder("match")
        .where({ [key]: value })
        .getOne()

      return match
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async updateMatch(body: UpdateMatchDTO, id: string): Promise<UpdateResult | undefined> {
    try {
      const match: UpdateResult = await this.matchRepository.update(id, body)

      if (match.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Update Match failed."
        })
      }

      return match

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

  public async deleteMatch(id: string): Promise<DeleteResult | undefined> {
    try {
      const match: DeleteResult = await this.matchRepository.delete(id)

      if (match.affected === 0) {
        throw new ErrorManager({
          type: "BAD_REQUEST",
          message: "Delete Match failed"
        })
      }

      return match

    } catch (error) {
      throw ErrorManager.createSignatureError(error.message)
    }
  }

}