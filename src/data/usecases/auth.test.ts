import { EncrypterSpy } from "../../../test/mocks/encrypter";
import { JwtServiceMock } from "../../../test/mocks/jwt";
import { UserRepositoryMock } from "../../../test/repostiory/user";
import { AuthUsecase } from "./auth";
import { makeValidUser } from "./createUser.test";

function makeSut() {
  const userRepository = new UserRepositoryMock();
  const encrypter = new EncrypterSpy();
  const jwtService = new JwtServiceMock();
  const authUsecase = new AuthUsecase(userRepository, encrypter, jwtService);
  userRepository.items = [makeValidUser()];
  return { authUsecase, userRepository, encrypter, jwtService };
}

describe("Auth usecase", () => {
  test("Should call userRepository.loadByEmail with correct values", async () => {
    const { authUsecase, userRepository } = makeSut();
    await authUsecase.execute({ email: "any_email", password: "any_password" });
    expect(userRepository.inputByEmail).toBe("any_email");
  });

  test("Should throw if user is not found", async () => {
    const { authUsecase, userRepository } = makeSut();
    userRepository.items = [];
    const response = authUsecase.execute({
      email: "any_email",
      password: "any_password",
    });
    expect(response).rejects.toEqual(new Error("Usuario não encontrado!"));
  });

  test("Should call encrypter.compare with correct values", async () => {
    const { authUsecase, encrypter } = makeSut();
    await authUsecase.execute({
      email: "any_email",
      password: "any_password",
    });
    expect(encrypter.pass).toBe("any_password");
    expect(encrypter.hashedPass).toBe("any_password");
  });

  test("Should throw if password is invalid", async () => {
    const { authUsecase, encrypter } = makeSut();
    encrypter.isPassValid = false;
    const response = authUsecase.execute({
      email: "any_email",
      password: "invalid_password",
    });
    expect(response).rejects.toEqual(new Error("Senha invalida!"));
  });

  test("Should call jwtService.genToken with correct values", async () => {
    const { authUsecase, jwtService } = makeSut();
    await authUsecase.execute({
      email: "any_email",
      password: "any_password",
    });
    const { password, ...user } = makeValidUser();
    expect(jwtService.genTokenInput).toEqual(user);
  });

  test("Should return an user and token if is authenticated", async () => {
    const { authUsecase } = makeSut();
    const response = await authUsecase.execute({
      email: "any_email",
      password: "any_password",
    });
    const { password, ...user } = makeValidUser();
    expect(response.user).toEqual(user);
    expect(response.token).toBe("access_token");
  });
});
