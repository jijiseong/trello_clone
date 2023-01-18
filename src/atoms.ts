import { atom } from "recoil";

export interface IData {
  id: number;
  text: string;
}

interface IAllBoardState {
  [boardId: string]: IData[];
}

export const boardIdListState = atom<string[]>({
  key: "boardIdList",
  default: [],
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
  default: false,
});

export const isCardDragState = atom({
  key: "isCardDragging",
  default: false,
});
