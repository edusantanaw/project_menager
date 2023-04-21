import { Squad } from "../../domain/entity/squad";
import { ICreateUsecase } from "../../domain/usecases/create";
import { CreateSquadData, ISquad } from "../../interfaces/squad";
import { ICreateRepository } from "../protocols/repository/createRepository";

export class CreateSquadUsecase
  implements ICreateUsecase<CreateSquadData, ISquad>
{
  constructor(private readonly squadRepository: ICreateRepository<ISquad>) {}

  public async execute(data: CreateSquadData): Promise<ISquad> {
    const squad = new Squad(data);
    const newSquad = await this.squadRepository.create(squad.getSquad());
    return newSquad;
  }
}
