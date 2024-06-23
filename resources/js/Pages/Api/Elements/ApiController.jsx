import { Box, Typography } from "@mui/material";
import React from "react";
import Retrieve from "./Controller/Retrieve";
import Store from "./Controller/Store";

function ApiController({ purpose }) {
    return (
        <Box>
            {purpose == 1 ? (
                <Retrieve />
            ) : purpose == 2 ? (
                <Store />
            ) : (
                <Typography className="centered">Please select the purpose of the API</Typography>
            )}
        </Box>
    );
}

export default ApiController;
