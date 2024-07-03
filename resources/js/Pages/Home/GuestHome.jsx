import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    IconButton,
} from "@mui/material";
import AppIcons from "../../configs/styles/AppIcons";

const features = [
    {
        text: "APIs",
        icon: "apis",
        description: "Explore and manage APIs for your application.",
    },
    {
        text: "Mock-Ups",
        icon: "mock_ups",
        description: "View and create mock-ups for your APIs.",
    },
    {
        text: "Templates",
        icon: "templates",
        description: "Browse and use pre-designed API templates.",
    },
    {
        text: "Cloud Services",
        icon: "cloud_services",
        description: "Manage cloud services and configurations.",
    },
    {
        text: "Data Repository",
        icon: "data_repository",
        description: "Access and manage your application's data.",
    },
    {
        text: "File Manager",
        icon: "file_manager",
        description: "Organize and upload files for your application.",
    },
    {
        text: "Keys Management",
        icon: "key_management",
        description: "Manage and secure API keys for your services.",
    },
    {
        text: "Users Management",
        icon: "user_management",
        description: "Administer user accounts and permissions.",
    },
    {
        text: "Logs",
        icon: "logs",
        description: "View logs and APIs history.",
    },
    {
        text: "Activity Log",
        icon: "activity_log",
        description: "Track and monitor user activity.",
    },
    {
        text: "Login Attempts",
        icon: "login_attempts",
        description: "View failed login attempts.",
    },
    {
        text: "Settings",
        icon: "settings",
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
                                {AppIcons[feature.icon]}
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
