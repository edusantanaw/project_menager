import { IUser } from "../../../interfaces/user";

export interface ILoadByEmailRepository {
  loadByEmail: (email: string) => Promise<IUser | null>;
}
