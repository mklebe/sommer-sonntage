import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";

export default function Account() {
    const { state } = useContext(UserContext);

    return (
        <h1>Willkommen {state.name}</h1>
    )
}