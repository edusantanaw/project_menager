import { IGenToken } from "../../src/data/protocols/helpers/jwt";
import { IUser } from "../../src/interfaces/user";

export class JwtServiceMock implements IGenToken {
    genTokenInput: unknown;
    public async genToken(data: IUser): Promise<string> {
      this.genTokenInput = data;
      return "access_token";
    }
  }
  