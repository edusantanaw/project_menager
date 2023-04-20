import { IUser } from "../../src/interfaces/user";
import { RepositoryMock } from "./repository";

export class UserRepositoryMock extends RepositoryMock<IUser> {
  inputByEmail: unknown;
  public async loadByEmail(email: string) {
    this.inputByEmail = email;
    const maybeUser = this.items.filter((u) => u.email === email);
    if (maybeUser.length === 0) return null;
    return maybeUser[0];
  }
}
