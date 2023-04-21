import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  name: string;
  leader: string;
};

export class Squad {
  private id: string;
  private name: string;
  private leader: string;

  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.name = data.name;
    this.leader = data.leader;
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

  public set setName(name: string) {
    this.name = name;
  }

  public get getLeader() {
    return this.leader;
  }

  public set setLeader(newLeader: string) {
    this.leader = newLeader;
  }

  public getSquad() {
    return {
      id: this.id,
      leader: this.leader,
      name: this.name,
    };
  }

  public addMember(userId: string) {
    const newMember = {
      id: randomUUID(),
      userId,
      squadId: this.id,
    };
    return newMember;
  }
}
