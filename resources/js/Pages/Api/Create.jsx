import React, { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Grid } from "@mui/material";
import ApiBuilder from "./Elements/ApiBuilder";
import ApiController from "./Elements/ApiController";

const Create = () => {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Apis", href: "/apis", icon: "whatshot" },
        { label: "Create", icon: "grain" },
    ];

    const [purpose, setPurpose] = useState("");

    return (
        <Layout links={links} title="Create New API">
            <Box container>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <ApiBuilder purpose={purpose} setPurpose={setPurpose} />
                    </Grid>
                    <Grid item xs={6}>
                        <ApiController  purpose={purpose} />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Create;
