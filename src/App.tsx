import { DropResult, DragDropContext } from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { allBoardState, boardModalState, isDarkState } from "./atoms";
import Board from "./components/Board";
import BoardModal from "./components/Modal";
import { darkTheme, lightTheme } from "./theme";

const GlobalStyle = createGlobalStyle`
  *{
    font-family:"Humanbumsuk" ;
  }
  body {
    margin: 0;
    background-color:${(props) => props.theme.backgroundColor} ;
    overflow: hidden;
    font-size: 10px;
  }
`;

const Boards = styled.div`
  background-color: ${(props) => props.theme.accentColor};
  padding: 20px;
  margin: 30px;

  display: grid;
  grid-template-rows: repeat(2, 350px);
  grid-template-columns: repeat(5, 1fr);
  align-items: flex-start;

  width: 90vw;
  border-radius: 30px;
  grid-row-gap: 1vw;
  min-width: 700px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  color: ${(props) => props.theme.textColor};

  width: 50px;
  height: 50px;
  font-size: 3em;
  border: 3px solid ${(props) => props.theme.accentColor};
  border-radius: 50%;
  background-color: inherit;

  :hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: 0.05s ease-in;
    cursor: pointer;
  }
  :active {
    background: var(--button-hover-bg-color);
  }

  span {
    opacity: 10;
  }
`;

const Container = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  width: 80vw;
  display: flex;
  justify-content: flex-end;
`;

function App() {
  const setIsOpen = useSetRecoilState(boardModalState);
  const [allBoards, setAllBoards] = useRecoilState(allBoardState);
  const [isDark, setIsDark] = useRecoilState(isDarkState);

  // Drag Event on `<Card> and <Boards>`
  const onDragEnd = (info: DropResult) => {
    const { draggableId, source, destination } = info;
    if (!destination) return;

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
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const convertMode = () => {
    setIsDark((cur) => !cur);
  };

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Container>
          <Header>
            <Button onClick={openModal}>
              <span>+</span>
            </Button>
            <Button onClick={convertMode}>
              <span>{isDark ? "🌞" : "🌚"}</span>
            </Button>
          </Header>
          <DragDropContext onDragEnd={onDragEnd}>
            <Boards>
              {Object.keys(allBoards).map((boardId) => (
                <Board key={boardId} boardId={boardId} />
              ))}
            </Boards>
          </DragDropContext>
        </Container>
        <BoardModal></BoardModal>
      </ThemeProvider>
    </>
  );
}

export default App;
