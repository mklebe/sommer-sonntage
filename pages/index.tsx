import { Typography } from "@mui/material";
import React from "react";
import LoginForm from "../components/LoginForm";
import { useRouter } from "../node_modules/next/router"

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Typography
        variant="h3"
      >Willkommen Bingodame</Typography>
      <Typography
        variant="body1"
      >Wen kann ich der noblen Gesellschaft ankündigen?</Typography>
      <LoginForm success={ () => { router.push('/account') } } />
    </>
  )
}
