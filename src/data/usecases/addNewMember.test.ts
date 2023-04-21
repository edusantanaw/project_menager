import { RepositoryMock } from "../../../test/repostiory/repository";
import { IMember } from "../../interfaces/member";
import { ISquad } from "../../interfaces/squad";
import { IUser } from "../../interfaces/user";
import { AddNewMemberUsecase } from "./addMember";
import { makeValidUser } from "./createUser.test";

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
  return {
    addNewMemberUsecase,
    squadRepository,
    userRepository,
    membersRepository,
  };
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
    const { id, ...rest } = membersRepository.inputCreate as IMember;
    expect(rest).toEqual({ squadId: "any_squad_id", userId: "any_id" });
  });
});
