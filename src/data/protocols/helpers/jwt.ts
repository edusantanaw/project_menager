import { IUser } from "../../../interfaces/user";

export interface IGenToken {
    genToken: (data: IUser) => Promise<string>;
  }