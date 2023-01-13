import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.cardColor};
  margin-bottom: 5px;
`;

interface IDragabbleCardProps {
  toDo: string;
  idx: number;
}

function DragabbleCard({ toDo, idx }: IDragabbleCardProps) {
  console.log(toDo, "has been rendered");
  return (
    <Draggable draggableId={toDo} index={idx}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

// if props didn`t changed, do not re-render
export default React.memo(DragabbleCard);
