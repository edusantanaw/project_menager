import { IGenHash } from "../../src/data/protocols/helpers/encypter";

export class EncrypterSpy implements IGenHash {
    genHashInput: unknown;
    public async genHash(pass: string): Promise<string> {
      this.genHashInput = pass;
      return "hashed_password";
    }
  }
  