import { IUser } from "../../../interfaces/user";
import { ICreateRepository } from "./createRepository";

export interface ICreateUserRepository extends ICreateRepository<IUser> {
  loadByEmail: (email: string) => Promise<IUser | null>;
}
