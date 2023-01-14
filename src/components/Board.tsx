import { log } from "console";
import React, { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { dataState, IData, IDataState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

interface AreaProps {
  isDragginOver: boolean;
  draggingFromThisWith: boolean;
}

interface BoardProps {
  data: IData[];
  boardId: string;
}

const Container = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 150px;
  width: 200px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Area = styled.div<AreaProps>`
  background-color: ${(props) =>
    props.isDragginOver ? props.theme.accentColor : props.theme.boardColor};
  flex-grow: 1;
  border-radius: 5px;
  transition: background-color 0.3s;
  padding: 10px;
`;

interface IForm {
  inputData: string;
}

const Form = styled.form``;

export default function Board({ data, boardId }: BoardProps) {
  const setData = useSetRecoilState(dataState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onSubmit = ({ inputData }: IForm) => {
    const newData: IData = { text: inputData, id: Date.now() };
    setData((oldData) => {
      const copyData = [...oldData[boardId]];
      copyData.push(newData);
      return { ...oldData, [boardId]: copyData };
    });
    setValue("inputData", "");
  };
  return (
    <Container>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("inputData", { required: true })}
          type="text"
          placeholder={`Add task ${boardId}`}
        />
      </Form>

      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDragginOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {data.map((d, idx) => (
              // key , draggableid are must be same
              <DragabbleCard key={d.id} data={d} idx={idx} />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Container>
  );
}
