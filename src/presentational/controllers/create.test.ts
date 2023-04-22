import { SchemaValidatorSpy } from "../../../test/mocks/helpers/schemaValidator";
import { CreateUsecaseSpy } from "../../../test/mocks/usecases/create";
import { ITask } from "../../interfaces/task";
import {
  BadRequest,
  Created,
  ExceptionResponse,
} from "../helpers/httpResponse";
import { CreateController } from "./create";

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
