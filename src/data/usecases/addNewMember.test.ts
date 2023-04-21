import { RepositoryMock } from "../../../test/repostiory/repository";
import { Squad } from "../../domain/entity/squad";
import {
  IAddNewMemberUsecase,
  addMemberData,
} from "../../domain/usecases/addNewMember";
import { ISquad } from "../../interfaces/squad";
import { IUser } from "../../interfaces/user";
import { ICreateRepository } from "../protocols/repository/createRepository";
import { ILoadByIdRepository } from "../protocols/repository/loadById";
import { makeValidUser } from "./createUser.test";

type IMember = {
    id: string;
    squadId: string;
    userId: string;
}

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
    if(!user) throw new Error("Usuario não encontrado!");               
    const newMember = squad.addMember(user.id);
    await this.membersRepository.create(newMember);
}
}


function makeSut() {
  const squadRepository = new RepositoryMock<ISquad>();
  const userRepository = new RepositoryMock<IUser>();
  const membersRepository = new RepositoryMock<IMember>();
  const addNewMemberUsecase = new AddNewMemberUsecase(
    squadRepository,
    userRepository,
    membersRepository
  );
  squadRepository.items = [
    { id: "any_squad_id", leader: "any_id", name: "any_name" },
  ];
  userRepository.items = [makeValidUser()];
  return { addNewMemberUsecase, squadRepository, userRepository , membersRepository};
}

describe("Add new member usecase", () => {
  test("Should call squadRepository.loadById with correct value", async () => {
    const { addNewMemberUsecase, squadRepository } = makeSut();
    await addNewMemberUsecase.execute({
      squadId: "any_squad_id",
      userId: "any_id",
    });
    expect(squadRepository.inputById).toBe("any_squad_id");
  });

  test("Should throw if squad is not found", () => {
    const { addNewMemberUsecase, squadRepository } = makeSut();
    squadRepository.items = [];
    const response = addNewMemberUsecase.execute({
      squadId: "invalid_id",
      userId: "any_id",
    });
    expect(response).rejects.toEqual(new Error("Equipe não encontrada!"));
  });

  test("Should call userRepository.loadById with correct value", async () => {
    const { addNewMemberUsecase, userRepository } = makeSut();
    await addNewMemberUsecase.execute({
      squadId: "any_squad_id",
      userId: "any_id",
    });
    expect(userRepository.inputById).toBe("any_id");
  });

  test("Should throw if user is not found", () => {
    const { addNewMemberUsecase, userRepository } = makeSut();
    userRepository.items = [];
    const response = addNewMemberUsecase.execute({
      squadId: "any_squad_id",
      userId: "invalid_id",
    });
    expect(response).rejects.toEqual(new Error("Usuario não encontrado!"));
  });

  test("Should call memberRepository.create with correct values", async () => {
    const { addNewMemberUsecase, membersRepository } = makeSut();
    await addNewMemberUsecase.execute({
      squadId: "any_squad_id",
      userId: "any_id",
    });
    const {id, ...rest} = membersRepository.inputCreate as IMember
    expect(rest).toEqual({squadId: "any_squad_id", userId: "any_id"});
  })

});
