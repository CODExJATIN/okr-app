export type KeyResultType = {
  id: string;
  description: string;
  progress: number;
  objectiveId: string;
};
export type OKRType = {
  title: string;
  id: string;
  isCompleted: boolean;
  keyResults: KeyResultType[];
};
