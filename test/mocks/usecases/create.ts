import { data } from "../../../src/data/usecases/createTask";
import { Task } from "../../../src/domain/entity/task";
import { ICreateUsecase } from "../../../src/domain/usecases/create";
import { ITask } from "../../../src/interfaces/task";

export class CreateUsecaseSpy implements ICreateUsecase<data, ITask> {
  public notFound = false;
  public input: unknown;
  public async execute(data: data): Promise<ITask> {
    this.input = data;
    const task = new Task(data);
    if (this.notFound) throw new Error("Tarefa não encontrada!");
    return task.getTask();
  }
}
