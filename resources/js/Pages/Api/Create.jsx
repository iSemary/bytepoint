import React from "react";
import CreationType from "../../Layout/Elements/CreationType";
import { Construction } from "@mui/icons-material";
import Layout from "../../Layout/Layout";
import { Grid, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function Create({ id }) {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "APIs",
            href: "/apis",
            icon: "whatshot",
        },
        { label: "Create", icon: "grain" },
    ];

    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Choose API Creation Method
            </Typography>
            <Typography variant="body1" gutterBottom>
                Select the creation type that suits your needs.
            </Typography>
            <Grid container spacing={3}>
                <CreationType
                    text="Manual"
                    sm="3"
                    description="Create your own API using the API builder"
                    url={`/apis/editor/`}
                    icon={<Construction />}
                />
                <CreationType
                    text="AI Copilot"
                    sm="3"
                    description="Unleash your creativity with our AI Copilot"
                    url={`/editor/copilot/`}
                    icon={<AutoAwesomeIcon />}
                />
            </Grid>
        </Layout>
    );
}
