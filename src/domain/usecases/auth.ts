import { IUser } from "../../interfaces/user";

export type authData = {
  email: string;
  password: string;
};

export interface IAuthUsecase {
  execute: (data: authData) => Promise<{ user: IUser; token: string }>;
}
