import { ICreateUsecase } from "../../domain/usecases/createSquad";

type ITask = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  expiresAt: string;
};

export class CreateTaskUsecase implements ICreateUsecase<any, ITask> {
  public async execute(data: any): Promise<ITask> {
    return {} as ITask;
  }
}
