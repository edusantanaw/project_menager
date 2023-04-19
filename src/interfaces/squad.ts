export type ISquad = {
  id: string;
  name: string;
  leader: string;
  members: string[];
  projects: string[];
};

export type CreateSquadData = {
  name: string;
  leader: string;
  members: string[];
  projects: string[];
};
