import { RepositoryMock } from "../../../test/repostiory/repository";
import { ITask } from "../../interfaces/task";
import { CreateTaskUsecase } from "./createTask";

function makeSut() {
  const boardRepository = new RepositoryMock<any>();
  const taskRepository = new RepositoryMock<ITask>();
  const createTaskUsecase = new CreateTaskUsecase(
    boardRepository,
    taskRepository
  );
  boardRepository.items = [{ id: "any_board_id" }];
  return { createTaskUsecase, boardRepository, taskRepository };
}

function makeValidTask(): ITask {
  return {
    assignedTo: "any",
    boardId: "any_board_id",
    description: "any",
    expiresAt: "any",
    id: "any",
    title: "any",
  };
}

describe("Create task usecase", () => {
  test("Should call boardRepository.loadById with correct values", async () => {
    const { createTaskUsecase, boardRepository } = makeSut();
    boardRepository.inputById = "any_board_id";
    await createTaskUsecase.execute(makeValidTask());
    expect(boardRepository.inputById).toBe("any_board_id");
  });

  test("Should throw if board not exists", () => {
    const { createTaskUsecase, boardRepository } = makeSut();
    boardRepository.items = [];
    const response = createTaskUsecase.execute(makeValidTask());
    expect(response).rejects.toEqual(new Error("Board não existe!"));
  });

  test("Should call taskRepository.create with correctValues", async () => {
    const { createTaskUsecase, taskRepository } = makeSut();
    await createTaskUsecase.execute(makeValidTask());
    expect(taskRepository.inputCreate).toEqual(makeValidTask());
  });

  test("Should return a new task if is created", async () => {
    const { createTaskUsecase } = makeSut();
    const response = await createTaskUsecase.execute(makeValidTask());
    expect(response).toEqual(makeValidTask());
  });
});
