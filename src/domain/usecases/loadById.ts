export interface ILoadByIdUsecase<T> {
  execute: (id: string) => Promise<T | null>;
}
