import { Project } from "../../domain/entity/project";
import { ICreateUsecase } from "../../domain/usecases/createSquad";
import { IProject } from "../../interfaces/project";
import { ISquad } from "../../interfaces/squad";
import { ICreateRepository } from "../protocols/repository/createRepository";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

type data = {
  name: string;
  squadId: string;
};

export class CreateProjectUsecase implements ICreateUsecase<data, IProject> {
  constructor(
    private readonly squadRepository: ILoadByIdRepository<ISquad>,
    private readonly projectRepository: ICreateRepository<IProject>
  ) {}
  public async execute(data: data): Promise<IProject> {
    const userExists = await this.squadRepository.loadById(data.squadId);
    if (!userExists) throw new Error("Usuario não encontrado!");
    const project = new Project(data);
    const newProject = await this.projectRepository.create(
      project.getProject()
    );
    return newProject;
  }
}
