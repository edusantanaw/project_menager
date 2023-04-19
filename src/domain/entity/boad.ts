import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  title: string;
  projectId: string;
};

export class Board {
  private id: string;
  private title: string;
  private projectId: string;
  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.title = data.title;
    this.projectId = data.projectId;
  }

  public get getId() {
    return this.id;
  }

  public set setId(id: string) {
    this.id = id;
  }

  public get getTitle() {
    return this.title;
  }

  public set setTitle(newTitle: string) {
    this.title = newTitle;
  }

  public get getProjectId() {
    return this.projectId;
  }

  public set setProjectId(id: string) {
    this.projectId = id;
  }

  public getBoard() {
    return {
      id: this.id,
      title: this.title,
      projectId: this.projectId,
    };
  }
}
