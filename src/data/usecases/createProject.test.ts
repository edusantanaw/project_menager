import { RepositoryMock } from "../../../test/repostiory/repository";
import { IProject } from "../../interfaces/project";
import { ISquad } from "../../interfaces/squad";
import { CreateProjectUsecase } from "./createProject";

function makeSut() {
  const squadRepository = new RepositoryMock<ISquad>();
  const projectRepository = new RepositoryMock<IProject>();
  const createProjectUsecase = new CreateProjectUsecase(
    squadRepository,
    projectRepository
  );
  squadRepository.items = [{ id: "any_id", leader: "any", name: "any" }];
  return { createProjectUsecase, squadRepository, projectRepository };
}

function makeValidProject() {
  return {
    id: "any_id",
    name: "any_name",
    squadId: "any_id",
  };
}

describe("Create project usecase", () => {
  test("Should throw if squad not exists ", () => {
    const { createProjectUsecase, squadRepository } = makeSut();
    squadRepository.items = [];
    const response = createProjectUsecase.execute(makeValidProject());
    expect(response).rejects.toEqual(new Error("Usuario não encontrado!"));
  });

  test("Should call squadRepository.loadById with correct values", async () => {
    const { createProjectUsecase, squadRepository } = makeSut();
    await createProjectUsecase.execute(makeValidProject());
    expect(squadRepository.inputById).toBe("any_id");
  });

  test("Should call projectRepository.create with correct values", async () => {
    const { createProjectUsecase, projectRepository } = makeSut();
    await createProjectUsecase.execute(makeValidProject());
    expect(projectRepository.inputCreate).toEqual(makeValidProject());
  });

  test("Should return a new project if is created", async () => {
    const { createProjectUsecase } = makeSut();
    const response = await createProjectUsecase.execute(makeValidProject());
    expect(response).toEqual(makeValidProject());
  });
});
