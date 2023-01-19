import { FormEvent, useEffect, useState } from "react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { allBoardState, IData } from "../atoms";
import { useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";

const Card = styled.div<{ isDragging: boolean }>`
  position: relative;
  color: ${(props) => props.theme.textColor};
  border-radius: 5px;
  border: 0;
  margin-bottom: 5px;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 20px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? props.theme.accentColor2 : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : null};
`;

const CardInput = styled.input`
  font-size: 20px;
  padding: 0;
  color: ${(props) => props.theme.textColor};
  background-color: inherit;
  width: 100%;
  height: 100%;
  border: 0;
  :focus {
    outline: 0;
  }
`;

const DeleteButton = styled.button`
  margin: 0;
  padding: 0;
  width: 30px;
  height: 30px;
  text-align: center;
  font-size: 1.1em;

  border: ${(props) => props.theme.accentColor} solid 1px;
  border-radius: 50%;
  color: ${(props) => props.theme.textColor};
  background-color: inherit;
  position: absolute;
  right: 10px;
  cursor: pointer;

  :hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: background-color 0.1s;
  }
  :active {
    background: var(--button-hover-bg-color);
  }
`;

interface IDragabbleCardProps {
  data: IData;
  idx: number;
  boardId: string;
}

interface IForm {
  inputData: string;
}

function DragabbleCard({ data, idx, boardId }: IDragabbleCardProps) {
  console.log("[Card]", data.text, idx, "has been rendered");
  const setAllBoards = useSetRecoilState(allBoardState);
  const [isHidden, setIsHidden] = useState(true);
  const { register, handleSubmit, setFocus, setError } = useForm<IForm>();

  const onSubmit = ({ inputData }: IForm) => {
    if (inputData === "") {
      setError(
        "inputData",
        { message: "입력하세요!!!" },
        { shouldFocus: true }
      );
    }
    updateBoard(inputData);
    setIsHidden(true);
  };

  const onBlur = (event: FormEvent<HTMLInputElement>) => {
    const data = event.currentTarget.value;
    if (data === "") {
      setError(
        "inputData",
        { message: "입력하세요!!!" },
        { shouldFocus: true }
      );
    }
    updateBoard(data);
    setIsHidden(true);
  };

  // text 수정
  const updateBoard = (newValue: string) => {
    setAllBoards((oldBoards) => {
      const copyBoard = [...oldBoards[boardId]];
      const srcItemIdx = copyBoard.findIndex((v) => v.id === data.id);
      const newItem = { id: data.id, text: newValue };

      if (srcItemIdx === undefined) {
        return oldBoards;
      }
      copyBoard[srcItemIdx] = newItem;
      return {
        ...oldBoards,
        [boardId]: copyBoard,
      };
    });
  };

  const onDoubleClick = () => {
    setIsHidden(false);
    setFocus("inputData");
  };

  const deleteCard = (id: number) => {
    setAllBoards((oldBoards) => {
      const copyBoard = [...oldBoards[boardId]];
      const findItemIdx = copyBoard.findIndex((value) => value.id === id);
      copyBoard.splice(findItemIdx, 1);

      return { ...oldBoards, [boardId]: copyBoard };
    });
  };

  useEffect(() => {
    setFocus("inputData");
  }, [isHidden]);

  return (
    <Draggable draggableId={data.id + ""} index={idx} key={data.id}>
      {(provided, snapshot) => {
        return (
          <Card
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onDoubleClick={onDoubleClick}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardInput
                {...register("inputData", { required: "입력하세요!!!" })}
                placeholder="입력하세요!"
                hidden={isHidden}
                defaultValue={data.text}
                onBlur={onBlur}
                spellCheck={false}
                autoComplete="off"
              />
            </form>
            <span hidden={!isHidden}>{data.text}</span>

            <DeleteButton onClick={() => deleteCard(data.id)}>x</DeleteButton>
          </Card>
        );
      }}
    </Draggable>
  );
}

// if props didn`t changed, do not re-render
export default React.memo(DragabbleCard);
