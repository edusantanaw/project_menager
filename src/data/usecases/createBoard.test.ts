import { RepositoryMock } from "../../../test/repostiory/repository";
import { IBoard } from "../../interfaces/board";
import { CreateBoardUsecase } from "./createBoard";

function makeSut() {
  const projectRepository = new RepositoryMock<any>();
  const boardRepository = new RepositoryMock<IBoard>();
  const createBoardUsecase = new CreateBoardUsecase(
    projectRepository,
    boardRepository
  );
  projectRepository.items = [{ id: "any_project_id" }];
  return { createBoardUsecase, projectRepository, boardRepository };
}

function makeValidBoard(): IBoard {
  return {
    id: "any_id",
    title: "any_title",
    projectId: "any_project_id",
  };
}

describe("Create board usecase", () => {
  test("Should throw if project not exists", () => {
    const { createBoardUsecase, projectRepository } = makeSut();
    projectRepository.items = [];
    const response = createBoardUsecase.execute(makeValidBoard());
    expect(response).rejects.toEqual(new Error("Projeto não encontrado!"));
  });

  test("Should call projectRepository.loadById with correct values", async () => {
    const { createBoardUsecase, projectRepository } = makeSut();
    await createBoardUsecase.execute(makeValidBoard());
    expect(projectRepository.inputById).toBe("any_project_id");
  });

  test("Should call boardRepository.create with correct values", async () => {
    const { createBoardUsecase, boardRepository } = makeSut();
    await createBoardUsecase.execute(makeValidBoard());
    expect(boardRepository.inputCreate).toEqual(makeValidBoard());
  });

  test("Should return a new board if is created", async () => {
    const { createBoardUsecase } = makeSut();
    const response = await createBoardUsecase.execute(makeValidBoard());
    expect(response).toEqual(makeValidBoard());
  });
});
