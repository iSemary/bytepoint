import React, { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Typography } from "@mui/material";
import ApiBuilder from "../Api/Elements/ApiBuilder";
import AITextArea from "../Api/Elements/AI/AITextArea";

const Copilot = () => {
    const [purpose, setPurpose] = useState("");

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Mockups", href: "/mock-ups", icon: "whatshot" },
        { label: "Create", href: "/mock-ups/create", icon: "grain" },
        { label: "Copilot", icon: "grain" },
    ];
    return (
        <Layout links={links} title="Create New Mockup | Using AI">
            <Box container>
                <Typography>Step 1: Describe your needs</Typography>
                <AITextArea />
                <br />
                {/* <ApiBuilder allowBody={false} /> */}
            </Box>
        </Layout>
    );
};

export default Copilot;
