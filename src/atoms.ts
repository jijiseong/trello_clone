import { atom } from "recoil";

export interface IData {
  id: number;
  text: string;
}

export interface IDataState {
  [key: string]: IData[];
}

interface IAllBoardState {
  [key: string]: IData[];
}

export const boardsId = atom<string[]>({
  key: "boardsId",
  default: ["toDo", "doing", "done"],
});

export const allBoardState = atom<IAllBoardState>({
  key: "boardList",
  default: {},
});

export const boardModalState = atom<boolean>({
  key: "boardModalState",
  default: false,
});

export const isDarkState = atom({
  key: "isDark",
  default: true,
});
