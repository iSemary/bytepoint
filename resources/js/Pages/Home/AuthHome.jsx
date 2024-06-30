import React from "react";
import Layout from "../../Layout/Layout";
import {
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    IconButton,
} from "@mui/material";
import { Link } from "@inertiajs/react";
import ApiIcon from "@mui/icons-material/Api";
import MockupIcon from "@mui/icons-material/Mouse";
import TemplateIcon from "@mui/icons-material/Description";
import CloudIcon from "@mui/icons-material/Cloud";
import DataIcon from "@mui/icons-material/DataUsage";
import FileManagerIcon from "@mui/icons-material/Folder";
import LogsIcon from "@mui/icons-material/History";
import ApiKeyIcon from "@mui/icons-material/VpnKey";
import UserIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const menuItems = [
    {
        text: "APIs",
        link: "/apis",
        icon: <ApiIcon />,
        description: "Explore and manage APIs for your application.",
    },
    {
        text: "Mock-Ups",
        link: "/mock-ups",
        icon: <MockupIcon />,
        description: "View and create mock-ups for your APIs.",
    },
    {
        text: "Templates",
        link: "/templates",
        icon: <TemplateIcon />,
        description: "Browse and use pre-designed API templates.",
    },
    {
        text: "Cloud Services",
        link: "/cloud-services",
        icon: <CloudIcon />,
        description: "Manage cloud services and configurations.",
    },
    {
        text: "Data Repository",
        link: "/data-repository",
        icon: <DataIcon />,
        description: "Access and manage your application's data.",
    },
    {
        text: "File Manager",
        link: "/file-manager",
        icon: <FileManagerIcon />,
        description: "Organize and upload files for your application.",
    },
    {
        text: "API Key Management",
        link: "/api-key-management",
        icon: <ApiKeyIcon />,
        description: "Manage and secure API keys for your services.",
    },
    {
        text: "User Management",
        link: "/user-management",
        icon: <UserIcon />,
        description: "Administer user accounts and permissions.",
    },
    {
        text: "Logs",
        link: "/logs",
        icon: <LogsIcon />,
        description: "View logs and APIs history.",
    },
    {
        text: "Activity Log",
        link: "/activity-log",
        icon: <ManageAccountsIcon />,
        description: "Track and monitor user activity.",
    },
    {
        text: "Login Attempts",
        link: "/login-attempts",
        icon: <WarningAmberIcon />,
        description: "View failed login attempts.",
    },
    {
        text: "Settings",
        link: "/settings",
        icon: <SettingsIcon />,
        description: "Configure application settings and preferences.",
    },
];

function AuthHome() {
    return (
        <Layout>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    {menuItems.map((item, index) => (
                        <Grid
                            key={index}
                            item
                            xs={12}
                            sm={3}
                            className={"animate__animated animate__fadeIn"}
                            style={{ animationDelay: `${index * 0.06}s` }}
                        >
                            <Card>
                                <CardActionArea
                                    component={Link}
                                    href={item.link}
                                >
                                    <CardContent
                                        sx={{
                                            minHeight: 120,
                                            maxHeight: 120,
                                            display: "grid",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Grid container alignItems="center">
                                            <Grid item xs={2}>
                                                <IconButton>
                                                    {item.icon}
                                                </IconButton>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography
                                                    variant="h5"
                                                    component="div"
                                                >
                                                    {item.text}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {item.description}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
}

export default AuthHome;
