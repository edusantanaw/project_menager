import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  title: string;
  description: string;
  assignedTo: string;
  expiresAt: string;
  boardId: string;
};

export class Task {
  private id: string;
  private title: string;
  private description: string;
  private assignedTo: string;
  private expiresAt: string;
  private boardId: string;

  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.title = data.title;
    this.description = data.description;
    this.assignedTo = data.assignedTo;
    this.expiresAt = data.expiresAt;
    this.boardId = data.boardId;
  }

  public getTask() {
    return {
      assignedTo: this.assignedTo,
      boardId: this.boardId,
      description: this.description,
      expiresAt: this.expiresAt,
      title: this.title,
      id: this.id,
    };
  }
}
