import React from "react";
import CreationType from "../../Layout/Elements/CreationType";
import { Construction } from "@mui/icons-material";
import Layout from "../../Layout/Layout";
import { Icon } from "@iconify/react";
import { Grid, Typography } from "@mui/material";

export default function Templates() {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Templates", icon: "templates" },
    ];

    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Templates
            </Typography>
            <Typography variant="body1" gutterBottom>
                Select one of our API templates
            </Typography>
            <Grid container spacing={3}>
                <CreationType
                    text="Fetch Data"
                    description="Create your own API using the API builder"
                    url="/templates/fetch-data"
                    icon={<Construction />}
                    sm={3}
                />
                <CreationType
                    text="Contact Us"
                    description="Create your own API using the API builder"
                    url="/templates/contact-us"
                    icon={<Construction />}
                    sm={3}
                />
                <CreationType
                    text="News Letter"
                    description="Unleash your creativity with our AI Copilot"
                    url="/templates/newsletter"
                    icon={<Icon icon="material-symbols:magic-button-outline" />}
                    sm={3}
                />
                <CreationType
                    text="IP to Location"
                    description="Unleash your creativity with our AI Copilot"
                    url="/templates/ip-to-location"
                    icon={<Icon icon="material-symbols:magic-button-outline" />}
                    sm={3}
                />
            </Grid>
        </Layout>
    );
}
