import { DropResult, DragDropContext } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { dataState, IData } from "./atoms";
import Board from "./components/Board";

const Cotainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const Title = styled.h1`
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 4em;
`;

function App() {
  const [data, setData] = useRecoilState(dataState);

  const onDragEnd = (info: DropResult) => {
    /**
     * move data
     * [a, b, c] => [a, b]
     * [d, e, f] => [d, e, f, c]
     */
    const { draggableId, source, destination } = info;
    if (!destination) return;
    setData((allBoards) => {
      const srcBoard = [...allBoards[source.droppableId]];
      const dstBoard = [...allBoards[destination.droppableId]];

      const srcItem = srcBoard.find((value) => value.id === +draggableId);
      if (srcItem === undefined) {
        return allBoards;
      }

      srcBoard.splice(source.index, 1);
      dstBoard.splice(destination.index, 0, srcItem);

      return {
        ...allBoards,
        [destination.droppableId]: dstBoard,
        [source.droppableId]: srcBoard,
      };
    });
  };

  return (
    <>
      <Title>Board</Title>
      <Cotainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Boards>
            {Object.keys(data).map((boardId) => (
              <Board key={boardId} boardId={boardId} data={data[boardId]} />
            ))}
          </Boards>
        </DragDropContext>
      </Cotainer>
    </>
  );
}

export default App;
