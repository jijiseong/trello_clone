import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { allBoardState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

interface AreaProps {
  isDragginOver: boolean;
  draggingFromThisWith: boolean;
}

interface BoardProps {
  boardId: string;
}

const Container = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 150px;
  min-width: 120px;
  max-height: 400px;

  width: 14vw;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Title = styled.div`
  text-align: center;
  font-size: 2em;
  font-weight: 300;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Area = styled.div<AreaProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) =>
    props.isDragginOver ? "rgba(0,0,0,0.15)" : props.theme.boardColor};
  flex-grow: 1;
  border-radius: 5px;
  transition: background-color 0.3s;
  padding: 10px;
`;

const BoardHeader = styled.header`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const AddButton = styled.button`
  position: absolute;
  right: 20px;
  border: 0;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-color: inherit;
  font-size: 20px;

  :hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: 0.05s ease-in;
    cursor: pointer;
  }
  :active {
    background: var(--button-hover-bg-color);
  }
`;

function Board({ boardId }: BoardProps) {
  console.log("[Board]", boardId, "rendered");
  const [allBoards, setAllBoards] = useRecoilState(allBoardState);
  const board = allBoards[boardId];

  const addData = () => {
    setAllBoards((oldBoards) => {
      const newData = { id: Date.now(), text: "" };
      const copyBoard = [...oldBoards[boardId]];
      copyBoard.push(newData);

      return {
        ...oldBoards,
        [boardId]: copyBoard,
      };
    });
  };

  return (
    <Container>
      <BoardHeader>
        <Title>{boardId}</Title>
        <AddButton onClick={addData}>+</AddButton>
      </BoardHeader>

      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDragginOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {board.map((d, idx) => (
              <DragabbleCard key={d.id} data={d} idx={idx} boardId={boardId} />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Container>
  );
}

export default React.memo(Board);
