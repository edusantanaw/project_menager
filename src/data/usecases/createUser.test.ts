import { UserRepositoryMock } from "../../../test/repostiory/user";
import { User } from "../../domain/entity/user";
import { ICreateUsecase } from "../../domain/usecases/createSquad";
import { IUser } from "../../interfaces/user";

type data = {
  username: string;
  email: string;
  password: string;
};

interface ICreateUserRepository {
  loadByEmail: (email: string) => Promise<IUser | null>;
  create: (data: IUser) => Promise<IUser>;
}

interface IGenHash {
  genHash: (pass: string) => Promise<string>;
}

interface IGenToken {
  genToken: (data: IUser) => Promise<string>;
}

export class CreateUserUsecase
  implements ICreateUsecase<data, { user: IUser; token: string }>
{
  constructor(
    private readonly userRepository: ICreateUserRepository,
    private readonly encrypter: IGenHash,
    private readonly jwtService: IGenToken
  ) {}
  public async execute(data: data): Promise<{ user: IUser; token: string }> {
    const emailAlreadyBeingUsed = !!(await this.userRepository.loadByEmail(
      data.email
    ));
    if (emailAlreadyBeingUsed) throw new Error("O email já está sendo usado!");
    const user = new User(data);
    const hashedPassword = await this.encrypter.genHash(user.getPassword);
    user.setPassword = hashedPassword;
    const newUser = await this.userRepository.create(user.getUser());
    const accessToken = await this.jwtService.genToken(newUser);
    return { user: newUser, token: accessToken };
  }
}

function makeValidUser() {
  return {
    email: "any_email",
    id: "any_id",
    username: "any_username",
    password: "any_password",
  };
}

class EncrypterSpy implements IGenHash {
  genHashInput: unknown;
  public async genHash(pass: string): Promise<string> {
    this.genHashInput = pass;
    return "hashed_password";
  }
}

class JwtServiceMock implements IGenToken {
  genTokenInput: unknown;
  public async genToken(data: IUser): Promise<string> {
    this.genTokenInput = data;
    return "access_token";
  }
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
