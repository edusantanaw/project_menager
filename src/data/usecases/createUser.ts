import { User } from "../../domain/entity/user";
import { ICreateUsecase } from "../../domain/usecases/createSquad";
import { IUser } from "../../interfaces/user";
import { IGenHash } from "../protocols/helpers/encypter";
import { IGenToken } from "../protocols/helpers/jwt";
import { ICreateUserRepository } from "../protocols/repository/createUser";

type data = {
  username: string;
  email: string;
  password: string;
};

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
