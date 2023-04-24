function HttpResponse<T>(status: number, data: T) {
  return {
    statusCode: status,
    body: data,
  };
}

function ExceptionResponse(error: unknown, status?: number) {
  const { message } = error as Error;
  return HttpResponse(status ?? 500, message);
}

const Ok = <T>(data: T) => HttpResponse<T>(200, data);
const Created = <T>(data: T) => HttpResponse<T>(201, data);
const NoContent = <T>(data: T) => HttpResponse<T>(204, data);
const BadRequest = <T>(data: T) => HttpResponse<T>(400, data);
const Unauthorized = <T>(data: T) => HttpResponse<T>(401, data);
const Forbbiden = <T>(data: T) => HttpResponse<T>(403, data);

export {
  HttpResponse,
  ExceptionResponse,
  Ok,
  BadRequest,
  Unauthorized,
  Forbbiden,
  Created,
  NoContent
};
