import React, { createRef, useContext } from "react";
import LoginForm from "../components/LoginForm";
import { UserContext } from "../context/userContext";
import { useRouter } from "../node_modules/next/router"

export default function Home() {
  const router = useRouter();

  return (
    <LoginForm success={ () => { router.push('/account') } } />
  )
}
