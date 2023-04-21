import { IAuthUsecase, authData } from "../../domain/usecases/auth";
import { IUser } from "../../interfaces/user";
import { IComparePass } from "../protocols/helpers/encypter";
import { IGenToken } from "../protocols/helpers/jwt";
import { ILoadByEmailRepository } from "../protocols/repository/loadByEmail";

export class AuthUsecase implements IAuthUsecase {
  constructor(
    private readonly userRepository: ILoadByEmailRepository,
    private readonly encrypter: IComparePass,
    private readonly jwtService: IGenToken
  ) {}

  public async execute(
    data: authData
  ): Promise<{ user: IUser; token: string }> {
    const userExists = await this.userRepository.loadByEmail(data.email);
    if (!userExists) throw new Error("Usuario não encontrado!");
    const isPassValid = await this.encrypter.compare(
      data.password,
      userExists.password!
    );
    if (!isPassValid) throw new Error("Senha invalida!");
    const { password, ...user } = userExists;
    const accessToken = await this.jwtService.genToken(user);
    return { user, token: accessToken };
  }
}
