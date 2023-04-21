import { ILoadByIdUsecase } from "../../domain/usecases/loadById";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

export class LoadByIdUsecase<T> implements ILoadByIdUsecase<T> {
  constructor(private readonly repository: ILoadByIdRepository<T>) {}
  public async execute(id: string): Promise<T | null> {
    const data = await this.repository.loadById(id);
    return data;
  }
}
