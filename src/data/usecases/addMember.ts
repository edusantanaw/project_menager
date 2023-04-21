import { Squad } from "../../domain/entity/squad";
import {
  IAddNewMemberUsecase,
  addMemberData,
} from "../../domain/usecases/addNewMember";
import { IMember } from "../../interfaces/member";
import { ISquad } from "../../interfaces/squad";
import { IUser } from "../../interfaces/user";
import { ICreateRepository } from "../protocols/repository/createRepository";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

export class AddNewMemberUsecase implements IAddNewMemberUsecase {
  constructor(
    private readonly squadRepository: ILoadByIdRepository<ISquad>,
    private readonly userRepository: ILoadByIdRepository<IUser>,
    private readonly membersRepository: ICreateRepository<IMember>
  ) {}
  public async execute(data: addMemberData): Promise<void> {
    const maybeSquad = await this.squadRepository.loadById(data.squadId);
    if (!maybeSquad) throw new Error("Equipe não encontrada!");
    const squad = new Squad(maybeSquad);
    const user = await this.userRepository.loadById(data.userId);
    if (!user) throw new Error("Usuario não encontrado!");
    const newMember = squad.addMember(user.id);
    await this.membersRepository.create(newMember);
  }
}
