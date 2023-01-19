import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { allBoardState, boardIdListState, IData } from "../atoms";
import DragabbleCard from "./DragabbleCard";

interface DropAreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

interface BoardProps {
  boardId: string;
  index: number;
  board: IData[];
}

const Container = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 90%;
  margin-right: 10px;
  transition: background-color 0.3s;
`;
const BoardHeader = styled.header`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: move;
`;
const Title = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;
const Buttons = styled.div`
  position: absolute;
  right: 15px;
  display: flex;
`;
const Button = styled.button`
  margin-right: 5px;
  color: ${(props) => props.theme.textColor};
  border: 2px solid ${(props) => props.theme.accentColor};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: inherit;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: background-color 0.1s ease-in;
    cursor: pointer;
  }
  :active {
    background: var(--button-hover-bg-color);
  }
`;
const DropArea = styled.div<DropAreaProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(0,0,0,0.15)" : props.theme.boardColor};
  flex-grow: 1;
  border-radius: 5px;
  transition: background-color 0.3s;
  padding: 20px;
`;
const Body = styled.div`
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  overflow-y: auto;

  ::-webkit-scrollbar {
    background-color: ${(props) => props.theme.accentColor2};

    width: 7px;
    border-radius: 30px;
    padding: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.textColor};

    border-radius: 10px;
  }
`;

function DraggableBoard({ boardId, index, board }: BoardProps) {
  const setAllBoards = useSetRecoilState(allBoardState);
  const setBoardIdList = useSetRecoilState(boardIdListState);

  if (!board) {
    return null;
  }
  console.log("[Board]", boardId, "rendered");

  const addCard = () => {
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
  const deleteBoard = () => {
    setAllBoards((oldBoards) => {
      const copy = { ...oldBoards };
      delete copy[boardId];
      console.log(copy);
      return copy;
    });
    setBoardIdList((oldIdList) => {
      const filtered = oldIdList.filter((val) => val !== boardId);
      return filtered;
    });
  };

  return (
    <Draggable key={boardId} draggableId={boardId} index={index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <BoardHeader {...provided.dragHandleProps}>
            <Title>{boardId}</Title>
            <Buttons>
              <Button onClick={addCard}>+</Button>
              <Button onClick={deleteBoard}>X</Button>
            </Buttons>
          </BoardHeader>

          <Body>
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
          </Body>
        </Container>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableBoard);
