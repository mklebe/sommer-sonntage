import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Account() {
    const { state } = useContext(UserContext);
    const router = useRouter();

    return (
        <>
            <h1>Willkommen {state.name}</h1>
            <p>Was für ein wundervoller Tag, hast du schon deine Tipps für die aktuelle Spielrunde abgegeben?</p>
            <Button
                variant="contained"
                onClick={() => {
                    router.push('/kategorien/Top100Rock');
                }}
            >Tipps abgeben</Button>
        </>
    )
}