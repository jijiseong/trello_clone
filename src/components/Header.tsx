import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { boardModalState, isDarkState } from "../atoms";

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
    opacity: 0;
    font-size: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
`;

const Container = styled.header`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 3px solid ${(props) => props.theme.accentColor};
  border-radius: 50%;
  margin-left: 8px;
  color: ${(props) => props.theme.textColor};
  font-size: 3em;
  background-color: inherit;
  :hover {
    background-color: ${(props) => props.theme.accentColor};
    transition: 0.5s ease-in;
    cursor: pointer;
  }
  &:active {
    background: var(--button-hover-bg-color);
    span {
      animation: "test";
    }
  }

  span {
    animation: ${spinAnimation} 0.5s;
  }
`;

function Header() {
  const setIsOpen = useSetRecoilState(boardModalState);
  const [isDark, setIsDark] = useRecoilState(isDarkState);

  const openModal = () => {
    setIsOpen(true);
  };

  const convertMode = () => {
    setIsDark((cur) => !cur);
  };

  return (
    <Container>
      <Button onClick={openModal}>
        <span>+</span>
      </Button>
      <Button onClick={convertMode}>
        <span>{isDark ? "🌚" : "🌞"}</span>
      </Button>
    </Container>
  );
}

export default Header;
