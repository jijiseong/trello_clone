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
  padding-left: 30px;
  padding-right: 30px;
  justify-content: center;
  align-items: center;
  width: 1800px;
  height: 800px;
  border-radius: 30px;

  background-color: ${(props) => props.theme.accentColor};
  transition: background-color 0.3s;
`;

function BoardList() {
  const [allBoards, setAllBoards] = useRecoilState(allBoardState);
  const [boardIdList, setBoardIdList] = useRecoilState(boardIdListState);
  const onDragEnd = (info: DropResult) => {
    const { source, destination, type } = info;
    if (!destination) return;
    switch (type) {
      case "card":
        if (
          // 변화가 없는 경우
          source.droppableId === destination.droppableId &&
          source.index === destination.index
        ) {
          break;
        } else if (source.droppableId === destination.droppableId) {
          setAllBoards((oldBoards) => {
            // Deep copy
            const srcBoard = [...oldBoards[source.droppableId]];
            const srcItem = srcBoard.splice(source.index, 1)[0]; // delete
            srcBoard.splice(destination.index, 0, srcItem); // add
            return {
              ...allBoards,
              [source.droppableId]: srcBoard,
            };
          });
        } else if (source.droppableId !== destination.droppableId) {
          setAllBoards((oldBoards) => {
            const srcBoard = [...oldBoards[source.droppableId]];
            const dstBoard = [...oldBoards[destination.droppableId]];
            const srcItem = srcBoard.splice(source.index, 1)[0]; // delete
            if (srcItem === undefined) {
              return oldBoards; // 무슨 경우인지 모르겠음 ㅡㅡ
            }
            dstBoard.splice(destination.index, 0, srcItem); // add
            return {
              ...allBoards,
              [source.droppableId]: srcBoard,
              [destination.droppableId]: dstBoard,
            };
          });
        }
        break;
      case "board":
        setBoardIdList((old) => {
          const copy = [...old];
          const item = copy.splice(source.index, 1)[0];
          copy.splice(destination.index, 0, item);
          return copy;
        });
        break;
    }
  };

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" type="board" direction="horizontal">
          {(provided) => (
            <DropArea ref={provided.innerRef} {...provided.droppableProps}>
              {boardIdList.map((boardId, index) => (
                <DragabbleBoard
                  key={boardId}
                  boardId={boardId}
                  index={index}
                  board={allBoards[boardId]}
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
