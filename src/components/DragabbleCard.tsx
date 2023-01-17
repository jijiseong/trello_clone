import { FormEvent, useEffect, useState } from "react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { allBoardState, IData } from "../atoms";
import { useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";

const Card = styled.div<{ isDragging: boolean }>`
  color: ${(props) => props.theme.textColor};
  border-radius: 5px;
  border: 0;
  margin-bottom: 5px;
  width: 10vw;
  height: 1vw;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 1.5em;

  background-color: ${(props) =>
    props.isDragging ? props.theme.accentColor2 : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : null};

  transform: 0.5s;
`;

const CardInput = styled.input`
  color: ${(props) => props.theme.textColor};
  background-color: inherit;
  width: 100%;
  height: 100%;
  border: 0;
  :focus {
    outline: 0;
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
  const { register, handleSubmit, setFocus } = useForm<IForm>();

  const onSubmit = ({ inputData }: IForm) => {
    setIsHidden(true);
    updateBoard(inputData);
  };

  const onBlur = (event: FormEvent<HTMLInputElement>) => {
    setIsHidden(true);
    updateBoard(event.currentTarget.value);
  };

  // text 수정
  const updateBoard = (newValue: string) => {
    setAllBoards((oldBoards) => {
      const copyBoard = [...oldBoards[boardId]];
      const newItem = { id: Date.now(), text: newValue };
      const srcItemIdx = copyBoard.findIndex((v) => v.id === data.id);
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
  };
  useEffect(() => {
    if (!isHidden) {
      setFocus("inputData");
    }
  }, [isHidden, setFocus]);

  return (
    <Draggable draggableId={data.id + ""} index={idx}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={onDoubleClick}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardInput
              {...register("inputData")}
              placeholder="입력하세요!"
              hidden={isHidden}
              defaultValue={data.text}
              onBlur={onBlur}
              spellCheck={false}
            />
          </form>

          <span hidden={!isHidden}>{data.text}</span>
        </Card>
      )}
    </Draggable>
  );
}

// if props didn`t changed, do not re-render
export default React.memo(DragabbleCard);
