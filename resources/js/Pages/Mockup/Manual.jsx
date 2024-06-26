import React, { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ApiBuilder from "../Api/Elements/ApiBuilder";

const Manual = () => {
    const [purpose, setPurpose] = useState("");

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Mockups", href: "/mock-ups", icon: "whatshot" },
        { label: "Create", icon: "grain" },
    ];
    return (
        <Layout links={links} title="Create New Mockup">
            <Box container>
                <Typography>Step 1: Run the main API</Typography>
                <br />
                <ApiBuilder allowBody={false} />
            </Box>
        </Layout>
    );
};

export default Manual;
