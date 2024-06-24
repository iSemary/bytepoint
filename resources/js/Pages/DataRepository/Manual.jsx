import React from "react";
import CreationType from "../../Layout/Elements/CreationType";
import { Construction } from "@mui/icons-material";
import Layout from "../../Layout/Layout";
import { Icon } from "@iconify/react";
import { Grid, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function Manual() {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Data Repository",
            href: "/data-repository",
            icon: "whatshot",
        },
        { label: "Create", href: "/data-repository/create", icon: "whatshot" },
        { label: "Manual", icon: "grain" },
    ];

    return <Layout links={links} title="Create Manual Data">
        
    </Layout>;
}
