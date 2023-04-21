import { EncrypterSpy } from "../../../test/mocks/encrypter";
import { JwtServiceMock } from "../../../test/mocks/jwt";
import { UserRepositoryMock } from "../../../test/repostiory/user";
import { CreateUserUsecase } from "./createUser";

function makeValidUser() {
  return {
    email: "any_email",
    id: "any_id",
    username: "any_username",
    password: "any_password",
  };
}


function makeSut() {
  const userRepository = new UserRepositoryMock();
  const encrypter = new EncrypterSpy();
  const jwtService = new JwtServiceMock();
  const createUserUsecase = new CreateUserUsecase(
    userRepository,
    encrypter,
    jwtService
  );
  return { createUserUsecase, userRepository, encrypter, jwtService };
}

describe("Create user usecase", () => {
  test("Should call userRepository.loadByEmail with correct value", async () => {
    const { userRepository, createUserUsecase } = makeSut();
    await createUserUsecase.execute(makeValidUser());
    expect(userRepository.inputByEmail).toBe("any_email");
  });

  test("Should throw if email is already being used", () => {
    const { createUserUsecase, userRepository } = makeSut();
    userRepository.items = [makeValidUser()];
    const response = createUserUsecase.execute(makeValidUser());
    expect(response).rejects.toEqual(new Error("O email já está sendo usado!"));
  });

  test("Should call encrypter.genHash with correct value", async () => {
    const { createUserUsecase, encrypter } = makeSut();
    await createUserUsecase.execute(makeValidUser());
    expect(encrypter.genHashInput).toEqual("any_password");
  });

  test("Should userRepository.create with correct values", async () => {
    const { createUserUsecase, userRepository } = makeSut();
    await createUserUsecase.execute(makeValidUser());
    expect(userRepository.inputCreate).toEqual({
      ...makeValidUser(),
      password: "hashed_password",
    });
  });

  test("Should jwtService.genToken with correct values", async () => {
    const { createUserUsecase, jwtService } = makeSut();
    await createUserUsecase.execute(makeValidUser());
    expect(jwtService.genTokenInput).toEqual({
      ...makeValidUser(),
      password: "hashed_password",
    });
  });

  test("Should return a user and token if is created", async () => {
    const { createUserUsecase } = makeSut();
    const response = await createUserUsecase.execute(makeValidUser());
    expect(response).toEqual({
      user: {
        ...makeValidUser(),
        password: "hashed_password",
      },
      token: "access_token",
    });
  });
});
