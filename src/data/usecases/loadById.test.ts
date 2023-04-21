import { RepositoryMock } from "../../../test/repostiory/repository";
import { ILoadByIdUsecase } from "../../domain/usecases/loadById";
import { IBoard } from "../../interfaces/board";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

export class LoadByIdUsecase<T> implements ILoadByIdUsecase<T> {
  constructor(private readonly repository: ILoadByIdRepository<T>) {}
  public async execute(id: string): Promise<T | null> {
    const data = await this.repository.loadById(id);
    return data;
  }
}

function makeSut() {
  const boardRepository = new RepositoryMock<IBoard>();
  const loadByIdUsecase = new LoadByIdUsecase<IBoard>(boardRepository);
  return { loadByIdUsecase, boardRepository };
}

describe("Load by id usecase", () => {
  test("Should call repository.loadById with correct value", async () => {
    const { boardRepository, loadByIdUsecase } = makeSut();
    await loadByIdUsecase.execute("any_id");
    expect(boardRepository.inputById).toBe("any_id");
  });

  test("Should return null if no content is found", async () => {
    const { loadByIdUsecase } = makeSut();
    const response = await loadByIdUsecase.execute("any_id");
    expect(response).toBe(null);
  });

  test("Should return all content if something is found", async () => {
    const { loadByIdUsecase, boardRepository } = makeSut();
    const board = { id: "any_id", projectId: "any_id", title: "any_title" };
    boardRepository.items = [board];
    const response = await loadByIdUsecase.execute("any_id");
    expect(response).toBe(board);
  });
});
