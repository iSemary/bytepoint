import React from "react";
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
import AppIcons from "../../configs/styles/AppIcons";

const menuItems = [
    {
        text: "APIs",
        link: "/apis",
        icon: "apis", 
        description: "Explore and manage APIs for your application.",
    },
    {
        text: "Mock-Ups",
        link: "/mock-ups",
        icon: "mock_ups",
        description: "View and create mock-ups for your APIs.",
    },
    {
        text: "Templates",
        link: "/templates",
        icon: "templates",
        description: "Browse and use pre-designed API templates.",
    },
    {
        text: "Cloud Services",
        link: "/cloud-services",
        icon: "cloud_services",
        description: "Manage cloud services and configurations.",
    },
    {
        text: "Data Repository",
        link: "/data-repository",
        icon: "data_repository",
        description: "Access and manage your application's data.",
    },
    {
        text: "File Manager",
        link: "/file-manager",
        icon: "file_manager",
        description: "Organize and upload files for your application.",
    },
    {
        text: "Keys Management",
        link: "/key-management",
        icon: "key_management",
        description: "Manage and secure API keys for your services.",
    },
    {
        text: "Users Management",
        link: "/user-management",
        icon: "user_management",
        description: "Administer user accounts and permissions.",
    },
    {
        text: "Logs",
        link: "/logs",
        icon: "logs",
        description: "View logs and APIs history.",
    },
    {
        text: "Activity Log",
        link: "/activity-log",
        icon: "activity_log",
        description: "Track and monitor user activity.",
    },
    {
        text: "Login Attempts",
        link: "/login-attempts",
        icon: "login_attempts",
        description: "View failed login attempts.",
    },
    {
        text: "Settings",
        link: "/settings",
        icon: "settings",
        description: "Configure application settings and preferences.",
    },
];

function AuthHome() {
    return (
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
                            <CardActionArea component={Link} href={item.link}>
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
                                                {AppIcons[item.icon]}
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
    );
}

export default AuthHome;
