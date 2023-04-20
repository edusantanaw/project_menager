import { User } from "../../domain/entity/user";
import { ICreateUsecase } from "../../domain/usecases/createSquad";

type IUser = {
  id: string;
  username: string;
  email: string;
  passord?: string;
};

type data = {
  username: string;
  email: string;
  password: string;
};

export class CreateUserUsecase implements ICreateUsecase<data, IUser> {
  public async execute(data: data): Promise<IUser> {
    const user = new User(data);
    return user.getUser();
  }
}
