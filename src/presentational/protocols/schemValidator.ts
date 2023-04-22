export interface ISchemaValidator<T> {
  isSchemaValid: (data: T) => string | null;
}
