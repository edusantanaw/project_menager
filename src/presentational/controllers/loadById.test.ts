import { ILoadByIdUsecase } from "../../domain/usecases/loadById";
import {
  BadRequest,
  ExceptionResponse,
  NoContent,
  Ok,
} from "../helpers/httpResponse";

type data = {
  id: string;
};

export class LoadByIdController<T> {
  constructor(private readonly loadByIdUsecase: ILoadByIdUsecase<T>) {}
  public async handle({ id }: data) {
    try {
      if (!id) return BadRequest("O id é necessario!");
      const item = await this.loadByIdUsecase.execute(id);
      if (!item) return NoContent("Item");
      return Ok(item);
    } catch (error) {
      return ExceptionResponse(error);
    }
  }
}

class LoadByIdUsecaseSpy<T> implements ILoadByIdUsecase<T> {
  public item: T | null = null;
  public input: unknown;
  public exeception:  boolean = false;
  public async execute(id: string): Promise<T | null> {
    this.input = id;
    if(this.exeception) throw new Error("Internal server error");
    return this.item;
  }
}

function makeSut() {
  const loadByIdUsecase = new LoadByIdUsecaseSpy();
  const loadByIdController = new LoadByIdController(loadByIdUsecase);
  return { loadByIdController, loadByIdUsecase };
}

describe("Load by id controller", () => {
  test("Should return a badRequest if id is not provided", async () => {
    const { loadByIdController } = makeSut();
    const response = await loadByIdController.handle({ id: "" });
    expect(response).toEqual(BadRequest("O id é necessario!"));
  });

  test("Should call loadByIdUSecase with correct values", async () => {
    const { loadByIdController, loadByIdUsecase } = makeSut();
    await loadByIdController.handle({ id: "any_id" });
    expect(loadByIdUsecase.input).toBe("any_id");
  });

  test("Should return a noContent if item is not found", async () => {
    const { loadByIdController } = makeSut();
    const response = await loadByIdController.handle({ id: "any_id" });
    expect(response).toEqual(NoContent("Item"));
  });
  
  test("Should return Ok if is found", async () => {
    const { loadByIdController , loadByIdUsecase} = makeSut();
    loadByIdUsecase.item = "Item";
    const response = await loadByIdController.handle({ id: "any_id" });
    expect(response).toEqual(Ok("Item"));
  });
 
  test("Should a status 500 if a server error happen", async () => {
    const { loadByIdController , loadByIdUsecase} = makeSut();
    loadByIdUsecase.exeception = true;
    const response = await loadByIdController.handle({ id: "any_id" });
    expect(response.statusCode).toBe(500);
  });
});
