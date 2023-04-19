import { RepositoryMock } from "../../../test/repostiory/repository";
import { Squad } from "../../domain/entity/squad";
import {
  CreateSquadData,
  ICreateSquadUsecase,
  ISquad,
} from "../../domain/usecases/createSquad";

interface ICreateRepository<T> {
  create: (data: T) => Promise<T>;
}

class CreateSquadUsecase implements ICreateSquadUsecase {
  constructor(private readonly squadRepository: ICreateRepository<ISquad>) {}

  public async execute(data: CreateSquadData): Promise<ISquad> {
    const squad = new Squad(data);
    const newSquad = await this.squadRepository.create(squad.getSquad());
    return newSquad;
  }
}

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
});
