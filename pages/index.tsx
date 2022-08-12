import React, { createRef, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useRouter } from "../node_modules/next/router"

export default function Home() {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const nameInput = createRef<HTMLInputElement>();

  function submitSignIn() {
    dispatch({type: "SET_NAME", payload: nameInput.current.value})
    router.push('/account')
  }

  return (
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitSignIn();
    }}>

      <input ref={nameInput} type="text" placeholder="Benutzername" />
      <button type="submit">Submit</button>
    </form>
  )
}
