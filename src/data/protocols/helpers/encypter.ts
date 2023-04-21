export interface IGenHash {
  genHash: (pass: string) => Promise<string>;
}
