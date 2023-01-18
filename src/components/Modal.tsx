import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { allBoardState, boardIdListState, boardModalState } from "../atoms";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Input = styled.input`
  padding: 10px 20px 10px 20px;
  font-size: 3em;
  height: 70px;
  width: 400px;
`;

interface IForm {
  boardName: string;
}
export default function BoardModal() {
  const [modalIsOpen, setIsOpen] = useRecoilState(boardModalState);
  const { register, handleSubmit, setValue, setFocus } = useForm<IForm>();
  const setAllBoards = useSetRecoilState(allBoardState);
  const setBoardIdList = useSetRecoilState(boardIdListState);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    setFocus("boardName");
  }

  function closeModal() {
    setIsOpen(false);
  }
  const onSubmit: SubmitHandler<IForm> = (data) => {
    // Add Board
    setAllBoards((oldBoards) => {
      const copyBoards = { ...oldBoards };
      copyBoards[data.boardName] = [];
      return copyBoards;
    });

    setBoardIdList((old) => {
      const copy = [...old];

      copy.push(data.boardName);
      return copy;
    });

    closeModal();
    setValue("boardName", "");
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("boardName", { required: "보드 이름을 입력해주세요." })}
          placeholder="보드 이름을 입력해주세요."
          spellCheck={false}
        />
      </form>
    </Modal>
  );
}
