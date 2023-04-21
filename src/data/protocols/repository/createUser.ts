import { IUser } from "../../../interfaces/user";
import { ICreateRepository } from "./createRepository";
import { ILoadByEmailRepository } from "./loadByEmail";

export interface ICreateUserRepository
  extends ICreateRepository<IUser>,
    ILoadByEmailRepository {}
