import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  name: string;
  squadId: string;
};

export class Project {
  private id: string;
  private name: string;
  private squadId: string;
  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.name = data.name;
    this.squadId = data.squadId;
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

  public get getSquadId() {
    return this.squadId;
  }

  public set setSquadId(id: string) {
    this.squadId = id;
  }

  public getProject() {
    return {
      id: this.id,
      name: this.name,
      squadId: this.squadId,
    };
  }
}
