import { atom, selector } from "recoil";

interface IDataState {
  [key: string]: string[];
}

export const dataState = atom<IDataState>({
  key: "data",
  default: {
    TO_DO: ["a", "b", "c"],
    DOING: ["d", "e"],
    DONE: ["f"],
  },
});

export const dataSelector = selector({
  key: "dataSelector",
  get: ({ get }) => {},
  set: ({ set }) => {},
});
