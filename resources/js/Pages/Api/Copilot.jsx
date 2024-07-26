import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { Typography, Box } from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";
import AITextArea from "../Api/Elements/AI/AITextArea";

export default function Copilot() {
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    /**
     * Save AI response to the data repository values
     * @param {*} e
     */
    const handleSaveAIData = (e) => {
        e.preventDefault();
        setSaveLoading(true);
        const payloadData = [];
        columns.forEach((column, index) => {
            const values = rows.map((row) => row[index]);
            payloadData.push({
                key: column,
                type: 1,
                values: values,
            });
        });
    };

    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Apis",
            href: "/apis",
            icon: "apis",
        },
        { label: "Create" },
        { label: "Copilot" },
    ];

    const actionButtons = [
        {
            label: "Save API",
            onClick: handleSaveAIData,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    return (
        <Layout
            links={links}
            title="Generate API & Data Repository"
            actionButtons={
                columns.length > 0 && rows.length > 0 ? actionButtons : ""
            }
        >
            <Box container>
                <Typography my={1}>Step 1: Describe your needs</Typography>
                <AITextArea type={2} />
                <br />
                {/* <ApiBuilder allowBody={false} /> */}
            </Box>
        </Layout>
    );
}
