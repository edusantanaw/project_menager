import { ICreateUsecase } from "../../domain/usecases/create";
import {
  BadRequest,
  Created,
  ExceptionResponse,
} from "../helpers/httpResponse";
import { ISchemaValidator } from "../protocols/schemValidator";

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
