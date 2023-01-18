import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { allBoardState, boardIdListState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

interface DropAreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

interface BoardProps {
  boardId: string;
}

const Container = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  width: 400px;
  height: 90%;
`;

const Title = styled.div`
  font-size: 2em;
  font-weight: 300;
`;

const DropArea = styled.div<DropAreaProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(0,0,0,0.3)" : props.theme.boardColor};
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
  margin: 20px;
`;

const AddButton = styled.button`
  position: absolute;
  color: ${(props) => props.theme.textColor};
  right: 0px;
  border: 2px solid ${(props) => props.theme.accentColor};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: inherit;
  font-size: 30px;

  :hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: 0.05s ease-in;
    cursor: pointer;
  }
  :active {
    background: var(--button-hover-bg-color);
  }
`;

function DraggableBoard({ boardId }: BoardProps) {
  console.log("[Board]", boardId, "rendered");
  const [allBoards, setAllBoards] = useRecoilState(allBoardState);
  const boardIdList = useRecoilValue(boardIdListState);
  const board = allBoards[boardId];
  const idx = boardIdList.findIndex((v) => v === boardId);

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
    <Draggable draggableId={boardId} index={idx}>
      {(provided) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <BoardHeader>
            <Title>{boardId}</Title>
            <AddButton onClick={addData}>+</AddButton>
          </BoardHeader>

          <Droppable droppableId={boardId} type="card">
            {(provided, snapshot) => (
              <DropArea
                isDraggingOver={snapshot.isDraggingOver}
                draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {board.map((d, idx) => (
                  <DragabbleCard
                    key={d.id}
                    data={d}
                    idx={idx}
                    boardId={boardId}
                  />
                ))}
                {provided.placeholder}
              </DropArea>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableBoard);
