import { Board } from "../../domain/entity/boad";
import { ICreateUsecase } from "../../domain/usecases/create";
import { CreateBoard, IBoard } from "../../interfaces/board";
import { ICreateRepository } from "../protocols/repository/createRepository";
import { ILoadByIdRepository } from "../protocols/repository/loadById";

export class CreateBoardUsecase implements ICreateUsecase<CreateBoard, IBoard> {
  constructor(
    private readonly projectRepository: ILoadByIdRepository<any>,
    private readonly boardRepository: ICreateRepository<IBoard>
  ) {}
  public async execute(data: CreateBoard): Promise<any> {
    const projectExists = await this.projectRepository.loadById(data.projectId);
    if (!projectExists) throw new Error("Projeto não encontrado!");
    const board = new Board(data);
    const newBoard = this.boardRepository.create(board.getBoard());
    return newBoard;
  }
}
