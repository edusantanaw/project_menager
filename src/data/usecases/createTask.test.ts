import { RepositoryMock } from "../../../test/repostiory/repository";
import { Task } from "../../domain/entity/task";
import { ICreateUsecase } from "../../domain/usecases/createSquad";
import { IBoard } from "../../interfaces/board";
import { ICreateRepository } from "../protocols/repository/createRepository";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

type ITask = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  expiresAt: string;
  boardId: string;
};

export class CreateTaskUsecase implements ICreateUsecase<any, ITask> {
  constructor(
    private readonly boardRepository: ILoadByIdRepository<IBoard>,
    private readonly taskRepository: ICreateRepository<ITask>
  ) {}
  public async execute(data: ITask): Promise<ITask> {
    const boardExists = await this.boardRepository.loadById(data.boardId);
    if (!boardExists) throw new Error("Board não existe!");
    const task = new Task(data);
    const newTask = await this.taskRepository.create(task.getTask());
    return newTask;
  }
}

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
});
