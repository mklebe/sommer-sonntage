import { useRouter } from "next/router";
import { createRef, ReactElement, useContext } from "react";
import { UserContext } from "../context/userContext";

type LoginFormProps = {
    success: () => void;
}

export default function LoginForm({ success }: LoginFormProps): ReactElement {
    const { dispatch } = useContext(UserContext);
    const nameInput = createRef<HTMLInputElement>();

    function submitSignIn() {
        dispatch({type: "SET_NAME", payload: nameInput.current.value});
        success();
    }

    return <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitSignIn();
      }}>
  
        <input ref={nameInput} type="text" placeholder="Benutzername" />
        <button type="submit">Anmelden</button>
      </form>
}