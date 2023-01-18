import { useRecoilValue } from "recoil";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { isDarkState } from "./atoms";
import BoardList from "./components/BoardList";
import Header from "./components/Header";
import BoardModal from "./components/Modal";
import { darkTheme, lightTheme } from "./theme";

const GlobalStyle = createGlobalStyle`
  *{
    font-family:"NanumSquareNeo-Variable" ;
  }
  body {
    margin: 0;
    background-color:${(props) => props.theme.backgroundColor} ;
    overflow: hidden;
    font-size: 10px;

    transition: 0.3s;
  }
`;

function App() {
  const isDark = useRecoilValue(isDarkState);

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Header />
        <BoardList />
        <BoardModal />
      </ThemeProvider>
    </>
  );
}

export default App;
