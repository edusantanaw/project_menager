interface IById {
  id: string;
}

export class RepositoryMock<T extends IById> {
  public items: T[] = [];
  public inputCreate: unknown;
  public inputById: unknown;
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
}
