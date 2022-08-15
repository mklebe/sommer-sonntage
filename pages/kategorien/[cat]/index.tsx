import styled from "@emotion/styled";
import { UnarchiveTwoTone } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormEventHandler } from "react";

export default function TipPage() {
    const router = useRouter();
    function submitTips(e: React.SyntheticEvent): void {
        e.preventDefault();
        router.push('/kategorien/Top100Rock/confirmation')
    }
    return <>
        <Typography>ROCK HARD - Die 100 besten Hard Rock und Heavy Metal Songs</Typography>
        <form onSubmit={submitTips}>
            <Grid>
                <input type="text" name="1_1"/>
                <input type="text" name="1_2"/>
                <input type="text" name="1_3"/>
                <input type="text" name="1_4"/>
                <input type="text" name="1_5"/>
                <input type="text" name="2_1"/>
                <input type="text" name="2_2"/>
                <input type="text" name="2_3"/>
                <input type="text" name="2_4"/>
                <input type="text" name="2_5"/>
                <input type="text" name="3_1"/>
                <input type="text" name="3_2"/>
                <input type="text" name="3_3"/>
                <input type="text" name="3_4"/>
                <input type="text" name="3_5"/>
                <input type="text" name="4_1"/>
                <input type="text" name="4_2"/>
                <input type="text" name="4_3"/>
                <input type="text" name="4_4"/>
                <input type="text" name="4_5"/>
                <input type="text" name="5_1"/>
                <input type="text" name="5_2"/>
                <input type="text" name="5_3"/>
                <input type="text" name="5_4"/>
                <input type="text" name="5_5"/>
            </Grid>
            <Grid>
                <Button type="submit" variant="contained">Tipps abschicken</Button>
            </Grid>
        </form>
    </>
}