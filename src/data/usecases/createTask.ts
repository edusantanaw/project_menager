import { Task } from "../../domain/entity/task";
import { ICreateUsecase } from "../../domain/usecases/createSquad";
import { IBoard } from "../../interfaces/board";
import { ITask } from "../../interfaces/task";
import { ICreateRepository } from "../protocols/repository/createRepository";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

export type data = {
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
  public async execute(data: data): Promise<ITask> {
    const boardExists = await this.boardRepository.loadById(data.boardId);
    if (!boardExists) throw new Error("Board não existe!");
    const task = new Task(data);
    const newTask = await this.taskRepository.create(task.getTask());
    return newTask;
  }
}
