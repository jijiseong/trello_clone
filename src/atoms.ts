import { atom, selector } from "recoil";

export interface IData {
  id: number;
  text: string;
}

export interface IDataState {
  [key: string]: IData[];
}

export const dataState = atom<IDataState>({
  key: "data",
  default: {
    TO_DO: [],
    DOING: [],
    DONE: [],
  },
});

export const dataSelector = selector({
  key: "dataSelector",
  get: (props) => {
    const data = props.get(dataState);
    console.log("get", props);
    return data;
  },
});
