import { IEncrypter } from "../../src/data/protocols/helpers/encypter";

export class EncrypterSpy implements IEncrypter {
  public genHashInput: unknown;
  public isPassValid = true;
  public pass: unknown;
  public hashedPass: unknown
  public async compare(pass: string, hashdPassword: string): Promise<boolean> {
    this.pass = pass;
    this.hashedPass = hashdPassword;
    return this.isPassValid;
  }

  public async genHash(pass: string): Promise<string> {
    this.genHashInput = pass;
    return "hashed_password";
  }
}
