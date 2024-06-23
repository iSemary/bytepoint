import React from "react";
import CreationType from "../../Layout/Elements/CreationType";
import { Construction } from "@mui/icons-material";
import Layout from "../../Layout/Layout";
import { Icon } from "@iconify/react";
import { Grid, Typography } from "@mui/material";

export default function Create() {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Mock-Ups", href: "/mock-ups", icon: "whatshot" },
        { label: "Create", icon: "grain" },
    ];

    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Choose Creation Type
            </Typography>
            <Typography variant="body1" gutterBottom>
                Select the creation type that suits your needs.
            </Typography>
            <Grid container spacing={2}>
                <CreationType
                    text="Manual"
                    description="Create your own API using the API builder"
                    url="/mock-ups/create/manual"
                    icon={<Construction />}
                />
                <CreationType
                    text="AI Copilot"
                    description="Unleash your creativity with our AI Copilot"
                    url="/mock-ups/create/copilot"
                    icon={<Icon icon="material-symbols:magic-button-outline" />}
                />
            </Grid>
        </Layout>
    );
}
