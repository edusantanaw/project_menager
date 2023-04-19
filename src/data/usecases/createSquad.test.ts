import { RepositoryMock } from "../../../test/repostiory/repository";
import { ISquad } from "../../domain/usecases/createSquad";
import { CreateSquadUsecase } from "./createSquad";

function makeSut() {
  const repository = new RepositoryMock<ISquad>();
  const createSquadUsecase = new CreateSquadUsecase(repository);
  return { createSquadUsecase, repository };
}

function makeValidSquad(): ISquad {
  return {
    id: "1234",
    leader: "1234",
    name: "test",
    members: [],
    projects: [],
  };
}

describe("Create squad usecase", () => {
  test("Should call squadRepository.create with correct values", async () => {
    const { createSquadUsecase, repository } = makeSut();
    await createSquadUsecase.execute(makeValidSquad());
    expect(repository.inputCreate).toEqual(makeValidSquad());
  });

  test("Should return a new squad if is created", async () => {
    const { createSquadUsecase } = makeSut();
    const response = await createSquadUsecase.execute(makeValidSquad());
    expect(response).toEqual(makeValidSquad());
  });
});
