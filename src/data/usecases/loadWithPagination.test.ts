import { RepositoryMock } from "../../../test/repostiory/repository";
import { Board } from "../../domain/entity/boad";
import { IBoard } from "../../interfaces/board";

type pagination = {
  take: number;
  skip: number;
};

interface ILoadWithPaginationRepository<T, P> {
  load: (data: P) => Promise<T[]>;
}

export class LoadWithPaginationUsecase<T, P extends pagination> {
  constructor(
    private readonly repository: ILoadWithPaginationRepository<T, P>
  ) {}
  public async execute(data: P) {
    data.take = data.take < 50 ? data.take : 50;
    const response = await this.repository.load(data);
    if (response.length === 0) return null;
    return response;
  }
}

function makeSut() {
  const repository = new RepositoryMock<IBoard>();
  const loadWithPaginationUsecase = new LoadWithPaginationUsecase<
    IBoard,
    { id: string; take: number; skip: number }
  >(repository);

  return { loadWithPaginationUsecase, repository };
}

describe("Load with pagination usecase", () => {
  test("Should call repository.load with correct values", async () => {
    const { loadWithPaginationUsecase, repository } = makeSut();
    const input = { id: "any_id", skip: 0, take: 10 };
    await loadWithPaginationUsecase.execute(input);
    expect(repository.paginationInput).toEqual(input);
  });

  test("Should take have a limit of 50 items", async () => {
    const { loadWithPaginationUsecase, repository } = makeSut();
    const input = { id: "any_id", skip: 0, take: 60 };
    await loadWithPaginationUsecase.execute(input);
    const take = repository.paginationInput as typeof input;
    expect(take.take).toEqual(50);
  });

  test("Should return null if no items are found", async () => {
    const { loadWithPaginationUsecase } = makeSut();
    const input = { id: "any_id", skip: 0, take: 10 };
    const output = await loadWithPaginationUsecase.execute(input);
    expect(output).toBe(null);
  });

  test("Should return null if no items are found", async () => {
    const { loadWithPaginationUsecase, repository } = makeSut();
    const board = new Board({
      projectId: "any_id",
      title: "any_title",
      id: "any_id",
    });
    repository.items = [board.getBoard()];
    const input = { id: "any_id", skip: 0, take: 10 };
    const output = await loadWithPaginationUsecase.execute(input);
    expect(output).toEqual([board.getBoard()]);
  });
});
