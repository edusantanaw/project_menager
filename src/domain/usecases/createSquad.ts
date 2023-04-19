import { ISquad } from "../../interfaces/squad";

export interface ICreateUsecase<T, R> {
  execute: (data: T) => Promise<R>;
}
