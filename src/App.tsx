import { DropResult, DragDropContext } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { dataState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
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

function App() {
  const [data, setData] = useRecoilState(dataState);

  const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
    if (!destination) return;
    setData((oldData) => {
      const newData = JSON.parse(JSON.stringify(oldData));
      newData[source.droppableId].splice(source.index, 1);
      newData[destination.droppableId].splice(
        destination.index,
        0,
        draggableId
      );

      return newData;
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(data).map((boardId) => (
              <Board key={boardId} boardId={boardId} toDos={data[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;
