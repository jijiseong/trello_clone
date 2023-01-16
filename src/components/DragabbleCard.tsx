import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IData } from "../atoms";

const Card = styled.input<{ isDragging: boolean }>`
  border-radius: 5px;
  border: 0;
  background-color: ${(props) =>
    props.isDragging ? props.theme.boardColor : props.theme.cardColor};
  margin-bottom: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : null};
  width: 200px;
  padding: 010px;
`;

interface IDragabbleCardProps {
  data: IData;
  idx: number;
}

function DragabbleCard({ data, idx }: IDragabbleCardProps) {
  console.log(data.text, idx, "has been rendered");
  return (
    <Draggable draggableId={data.id + ""} index={idx}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          value={data.text}
        ></Card>
      )}
    </Draggable>
  );
}

// if props didn`t changed, do not re-render
export default React.memo(DragabbleCard);
