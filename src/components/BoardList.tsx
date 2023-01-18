import React from "react";
import { DropResult, DragDropContext, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { allBoardState, boardIdListState } from "../atoms";
import DragabbleBoard from "./DragabbleBoard";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropArea = styled.div`
  display: flex;
  gap: 10px;
  padding-left: 30px;
  padding-right: 30px;
  justify-content: center;
  align-items: center;
  width: 1800px;
  height: 800px;
  border-radius: 30px;

  background-color: ${(props) => props.theme.accentColor};
`;

function BoardList() {
  const [allBoards, setAllBoards] = useRecoilState(allBoardState);
  const [boardIdList, setBoardIdList] = useRecoilState(boardIdListState);

  const onDragEnd = (info: DropResult) => {
    const { draggableId, source, destination, type } = info;
    if (!destination) return;
    switch (type) {
      case "card":
        setAllBoards((oldBoards) => {
          // Deep copy
          const srcBoard = [...oldBoards[source.droppableId]];
          const dstBoard = [...oldBoards[destination.droppableId]];

          // Find dragged item
          const srcItem = srcBoard.find((value) => value.id === +draggableId);
          if (srcItem === undefined) {
            return allBoards;
          }

          // Modify source board and destination board, not all Board
          if (source.droppableId === destination.droppableId) {
            srcBoard.splice(source.index, 1); // delete
            srcBoard.splice(destination.index, 0, srcItem); // add
            return {
              ...allBoards,
              [source.droppableId]: srcBoard,
            };
          } else {
            srcBoard.splice(source.index, 1); // delete
            dstBoard.splice(destination.index, 0, srcItem); // add

            return {
              ...allBoards,
              [source.droppableId]: srcBoard,
              [destination.droppableId]: dstBoard,
            };
          }
        });
        break;
      case "board":
        console.log(info);
        setBoardIdList((old) => {
          const copy = [...old];
          console.log(copy);

          copy.splice(source.index, 1);
          copy.splice(destination.index, 0, draggableId);
          return copy;
        });
        break;
    }
  };

  console.log("allBoards:", allBoards);
  console.log("boardIdList:", boardIdList);

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" type="board" direction="horizontal">
          {(provided) => (
            <DropArea ref={provided.innerRef} {...provided.droppableProps}>
              {boardIdList.map((boardId) => (
                <DragabbleBoard
                  key={boardId}
                  boardId={boardId}
                ></DragabbleBoard>
              ))}
              {provided.placeholder}
            </DropArea>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
}

export default React.memo(BoardList);
