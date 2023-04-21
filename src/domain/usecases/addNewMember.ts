export type addMemberData = {
  squadId: string;
  userId: string;
};

export interface IAddNewMemberUsecase {
  execute: (data: addMemberData) => Promise<void>;
}
