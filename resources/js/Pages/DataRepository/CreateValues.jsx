import React from "react";
import CreationType from "../../Layout/Elements/CreationType";
import { Construction } from "@mui/icons-material";
import Layout from "../../Layout/Layout";
import { Grid, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function CreateValues({ id }) {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Data Repository",
            href: "/data-repository",
            icon: "data_repository",
        },
        { label: "Create Values" },
    ];

    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Choose Values Creation Method
            </Typography>
            <Typography variant="body1" gutterBottom>
                Select the creation type that suits your needs.
            </Typography>
            <Grid container spacing={3}>
                <CreationType
                    text="Manual"
                    sm="3"
                    description="Create your own API using the API builder"
                    url={`/data-repository/create-values/${id}/manual`}
                    icon={<Construction />}
                />
                <CreationType
                    text="Import"
                    sm="3"
                    description="Import xlsx or csv file"
                    url={`/data-repository/create-values/${id}/import`}
                    icon={<UploadFileIcon />}
                />
                <CreationType
                    text="AI Copilot"
                    sm="3"
                    description="Unleash your creativity with our AI Copilot"
                    url={`/data-repository/create-values/${id}/copilot`}
                    icon={<AutoAwesomeIcon />}
                />
            </Grid>
        </Layout>
    );
}
