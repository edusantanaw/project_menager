import { randomUUID } from "node:crypto";

type data = {
  id?: string;
  name: string;
  leader: string;
  members: string[];
  projects: string[];
};

export class Squad {
  private id: string;
  private name: string;
  private leader: string;
  private members: string[] = [];
  private projects: string[] = [];
  constructor(data: data) {
    this.id = data.id ?? randomUUID();
    this.name = data.name;
    this.leader = data.leader;
    this.members = data.members;
    this.projects = data.projects;
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

  public get getMembers() {
    return this.members;
  }

  public set setMembers(newMembers: string[]) {
    this.members = newMembers;
  }

  public get getProject() {
    return this.projects;
  }

  public set setProjects(newProjects: string[]) {
    this.projects = newProjects;
  }

  public addMembers(newMember: string) {
    this.members.push(newMember);
  }

  public removeMember(member: string) {
    const findMemberIndex = this.members.findIndex((m) => m === member);
    if (!findMemberIndex) return;
    const updatedMembers = this.members.splice(findMemberIndex, 1);
    this.members = updatedMembers;
  }

  public addProject(newProject: string) {
    this.projects.push(newProject);
  }

  public removeProject(project: string) {
    const findProjectIndex = this.projects.findIndex((m) => m === project);
    if (!findProjectIndex) return;
    const updatedProjects = this.projects.splice(findProjectIndex, 1);
    this.members = updatedProjects;
  }

  public getSquad() {
    return {
      id: this.id,
      leader: this.leader,
      members: this.members,
      projects: this.projects,
      name: this.name,
    };
  }
}
