import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  username: string;
  email: string;
  password: string;
};

export class User {
  private id: string;
  private username: string;
  private email: string;
  private password: string;

  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
  }

  public getUser() {
    return {
      email: this.email,
      password: this.password,
      username: this.username,
      id: this.id,
    };
  }

  public get getPassword() {
    return this.password;
  }

  public set setPassword(pass: string) {
    this.password = pass;
  }
}
