import CreatePoll from "@/components/pollForm";
import PrimarySearchAppBar from "@/components/navigation";
import React from "react";
import Box from "@mui/material/Box";

export default function Form() {
    return (
        <main>
            <div>
                <PrimarySearchAppBar/>
                <br/>
                <Box justifyContent='center' flexDirection="row" alignItems="center" sx={{ display: "flex", flexGrow: 1 }}>  
                    <CreatePoll/>
                </Box>
            </div>
        </main>
    )
}