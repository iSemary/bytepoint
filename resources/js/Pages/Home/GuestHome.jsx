import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    IconButton,
} from "@mui/material";
import ApiIcon from "@mui/icons-material/Api";
import MockupIcon from "@mui/icons-material/PhoneAndroid";
import TemplateIcon from "@mui/icons-material/Description";
import CloudIcon from "@mui/icons-material/Cloud";
import DataIcon from "@mui/icons-material/Storage";
import FileManagerIcon from "@mui/icons-material/Folder";
import ApiKeyIcon from "@mui/icons-material/VpnKey";
import UserIcon from "@mui/icons-material/Person";
import LogsIcon from "@mui/icons-material/Receipt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SettingsIcon from "@mui/icons-material/Settings";
import Layout from "../../Layout/Layout";

const features = [
    {
        text: "APIs",
        icon: <ApiIcon />,
        description: "Explore and manage APIs for your application.",
    },
    {
        text: "Mock-Ups",
        icon: <MockupIcon />,
        description: "View and create mock-ups for your APIs.",
    },
    {
        text: "Templates",
        icon: <TemplateIcon />,
        description: "Browse and use pre-designed API templates.",
    },
    {
        text: "Cloud Services",
        icon: <CloudIcon />,
        description: "Manage cloud services and configurations.",
    },
    {
        text: "Data Repository",
        icon: <DataIcon />,
        description: "Access and manage your application's data.",
    },
    {
        text: "File Manager",
        icon: <FileManagerIcon />,
        description: "Organize and upload files for your application.",
    },
    {
        text: "Keys Management",
        icon: <ApiKeyIcon />,
        description: "Manage and secure API keys for your services.",
    },
    {
        text: "Users Management",
        icon: <UserIcon />,
        description: "Administer user accounts and permissions.",
    },
    {
        text: "Logs",
        icon: <LogsIcon />,
        description: "View logs and APIs history.",
    },
    {
        text: "Activity Log",
        icon: <ManageAccountsIcon />,
        description: "Track and monitor user activity.",
    },
    {
        text: "Login Attempts",
        icon: <WarningAmberIcon />,
        description: "View failed login attempts.",
    },
    {
        text: "Settings",
        icon: <SettingsIcon />,
        description: "Configure application settings and preferences.",
    },
];

export default function GuestHome() {
    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    BytePoint CloudAPI
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    A comprehensive solution for cloud hosting, offering a range
                    of powerful features to streamline your development process.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    With custom endpoints URLs, you can tailor your API to fit
                    your specific needs seamlessly.
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2, textAlign: "center" }}>
                            <IconButton size="large" color="primary">
                                {feature.icon}
                            </IconButton>
                            <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                            >
                                {feature.text}
                            </Typography>
                            <Typography variant="body2">
                                {feature.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
