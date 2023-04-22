import { data } from "../../../src/data/usecases/createTask";
import { ISchemaValidator } from "../../../src/presentational/protocols/schemValidator";

export class SchemaValidatorSpy implements ISchemaValidator<data> {
  public returnContent: string | null = null;
  public input: unknown;
  isSchemaValid(data: data): string | null {
    this.input = data;
    return this.returnContent;
  }
}
