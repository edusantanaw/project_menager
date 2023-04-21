import { data } from "../../data/usecases/createTask";
import { Task } from "../../domain/entity/task";
import { ICreateUsecase } from "../../domain/usecases/create";
import { ITask } from "../../interfaces/task";
import {
  BadRequest,
  Created,
  ExceptionResponse,
} from "../helpers/httpResponse";

interface ISchemaValidator<T> {
  isSchemaValid: (data: T) => string | null;
}

export class CreateController<T, D> {
  constructor(
    private readonly schemaValidator: ISchemaValidator<T>,
    private readonly createUsecase: ICreateUsecase<T, D>
  ) {}

  public async handle(data: T) {
    try {
      const maybeMessageError = this.schemaValidator.isSchemaValid(data);
      if (maybeMessageError) return BadRequest(maybeMessageError);
      const response = await this.createUsecase.execute(data);
      return Created(response);
    } catch (err) {
      return ExceptionResponse(err, 400);
    }
  }
}

class CreateUsecaseSpy implements ICreateUsecase<data, ITask> {
  public notFound = false;
  public input: unknown;
  public async execute(data: data): Promise<ITask> {
    this.input = data;
    const task = new Task(data);
    if (this.notFound) throw new Error("Tarefa não encontrada!");
    return task.getTask();
  }
}

class SchemaValidatorSpy implements ISchemaValidator<data> {
  public returnContent: string | null = null;
  public input: unknown;
  isSchemaValid(data: data): string | null {
    this.input = data;
    return this.returnContent;
  }
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

function makeSut() {
  const createUsecase = new CreateUsecaseSpy();
  const schemaValidator = new SchemaValidatorSpy();
  const controller = new CreateController(schemaValidator, createUsecase);
  return { createUsecase, controller, schemaValidator };
}

describe("Create controller", () => {
  test("Should call schemaValidator with correct values", async () => {
    const { controller, schemaValidator } = makeSut();
    await controller.handle(makeValidTask());
    expect(schemaValidator.input).toEqual(makeValidTask());
  });

  test("Should return a badRequest if schema is invalid ", async () => {
    const { controller, schemaValidator } = makeSut();
    schemaValidator.returnContent = "schema invalid";
    const response = await controller.handle(makeValidTask());
    expect(response).toEqual(BadRequest("schema invalid"));
  });

  test("Should call usecase.execute with correct values", async () => {
    const { controller, createUsecase } = makeSut();
    await controller.handle(makeValidTask());
    expect(createUsecase.input).toEqual(makeValidTask());
  });

  test("Should return status 400 if createUsecase failed", async () => {
    const { controller, createUsecase } = makeSut();
    createUsecase.notFound = true;
    const response = await controller.handle(makeValidTask());
    expect(response).toEqual(
      ExceptionResponse(new Error("Tarefa não encontrada!"), 400)
    );
  });

  test("Should return an status code 201 and a new entity", async () => {
    const { controller } = makeSut();
    const response = await controller.handle(makeValidTask());
    expect(response).toEqual(Created(makeValidTask()));
  });
});
