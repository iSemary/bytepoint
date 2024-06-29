import React, { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Grid } from "@mui/material";
import ApiBuilder from "./Elements/ApiBuilder";
import ApiController from "./Elements/ApiController";
import SaveIcon from "@mui/icons-material/Save";

const Create = () => {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Apis", href: "/apis", icon: "whatshot" },
        { label: "Create", icon: "grain" },
    ];

    const [purpose, setPurpose] = useState("1");
    const [saveLoading, setSaveLoading] = useState(false);

    const handleSaveAPI = () => {
        setSaveLoading(true);

        axiosConfig
            .post(`apis`)
            .then((response) => {
                
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const actionButtons = [
        {
            label: "Save",
            onClick: handleSaveAPI,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    return (
        <Layout
            links={links}
            actionButtons={actionButtons}
            title="Create New API"
        >
            <Box container>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <ApiBuilder purpose={purpose} setPurpose={setPurpose} />
                    </Grid>
                    <Grid item xs={6}>
                        <ApiController purpose={purpose} />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Create;
