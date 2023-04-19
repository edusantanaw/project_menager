import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  name: string;
  ownerId: string;
};

export class Project {
  private id: string;
  private name: string;
  private ownerId: string;
  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.name = data.name;
    this.ownerId = data.ownerId;
  }

  public get getId() {
    return this.id;
  }

  public set setId(id: string) {
    this.id = id;
  }

  public get getName() {
    return this.name;
  }

  public set setName(newName: string) {
    this.name = newName;
  }

  public get getOwnerId() {
    return this.ownerId;
  }

  public set setOwnerId(id: string) {
    this.ownerId = id;
  }

  public getProject() {
    return {
      id: this.id,
      name: this.name,
      ownerId: this.ownerId,
    };
  }
}
