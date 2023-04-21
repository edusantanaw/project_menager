export interface IGenHash {
  genHash: (pass: string) => Promise<string>;
}

export interface IComparePass {
  compare: (pass: string, hashdPassword: string) => Promise<boolean>;
}

export interface IEncrypter extends IGenHash, IComparePass {}
