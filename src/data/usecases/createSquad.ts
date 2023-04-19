import { Squad } from "../../domain/entity/squad";
import {
  CreateSquadData,
  ICreateSquadUsecase,
  ISquad,
} from "../../domain/usecases/createSquad";
import { ICreateRepository } from "../protocols/repository/createRepository";

export class CreateSquadUsecase implements ICreateSquadUsecase {
  constructor(private readonly squadRepository: ICreateRepository<ISquad>) {}

  public async execute(data: CreateSquadData): Promise<ISquad> {
    const squad = new Squad(data);
    const newSquad = await this.squadRepository.create(squad.getSquad());
    return newSquad;
  }
}
