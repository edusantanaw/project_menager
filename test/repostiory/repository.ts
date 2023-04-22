interface IById {
  id: string;
}

export class RepositoryMock<T extends IById> {
  public items: T[] = [];
  public inputCreate: unknown;
  public inputById: unknown;
  public paginationInput: unknown;

  public async create(item: T) {
    this.inputCreate = item;
    this.items.push(item);
    return item;
  }

  public async loadById(id: string) {
    this.inputById = id;
    const item = this.items.filter((i) => i.id === id);
    if (item.length === 0) return null;
    return item[0];
  }

  public async load(data: { id: string; skip: number; take: number }) {
    this.paginationInput = data;
    const response = this.items.filter((item) => item.id === data.id);
    return response.slice(data.take * data.skip, data.take);
  }
}
