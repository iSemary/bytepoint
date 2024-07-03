import React from "react";
import {
    Box,
    CircularProgress,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { Link } from "@inertiajs/react";
import AppIcons from "../configs/styles/AppIcons";

export default function Sidebar({ user, userLoading, open, setOpen }) {
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            {userLoading ? (
                <CircularProgress color="inherit" size={24} />
            ) : user ? (
                <>
                    <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                        <img
                            src="https://placehold.co/60x60"
                            alt="user"
                            style={{
                                borderRadius: "50%",
                                width: 60,
                                height: 60,
                                marginRight: 10,
                            }}
                        />
                        <Typography variant="subtitle2">
                            {user?.data?.data?.customer?.customer_name}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                        <img
                            src="https://placehold.co/60x60"
                            alt="user"
                            style={{
                                borderRadius: "50%",
                                width: 60,
                                height: 60,
                                marginRight: 10,
                            }}
                        />
                        <Typography variant="subtitle2">
                            {user?.data?.data?.user?.name}
                        </Typography>
                    </Box>
                </>
            ) : (
                <></>
            )}
            <Divider />
            <List>
                {[
                    { text: "Dashboard", link: "/", icon: "home" },
                    { text: "APIs", link: "/apis", icon: "apis" },
                    {
                        text: "Mock-Ups",
                        link: "/mock-ups",
                        icon: "mock_ups",
                    },
                    {
                        text: "Templates",
                        link: "/templates",
                        icon: "templates",
                    },
                    {
                        text: "Cloud Services",
                        link: "/cloud-services",
                        icon: "cloud_services",
                    },
                    {
                        text: "Data Repository",
                        link: "/data-repository",
                        icon: "data_repository",
                    },
                    {
                        text: "File Manager",
                        link: "/file-manager",
                        icon: "file_manager",
                    },
                    { text: "Logs", link: "/logs", icon: "logs" },
                    {
                        text: "Activity Log",
                        link: "/activity-log",
                        icon: "activity_log",
                    },
                    {
                        text: "Keys Management",
                        link: "/key-management",
                        icon: "key_management",
                    },
                    {
                        text: "Users Management",
                        link: "/user-management",
                        icon: "user_management",
                    },
                    {
                        text: "Login Attempts",
                        link: "/login-attempts",
                        icon: "login_attempts",
                    },
                    {
                        text: "Settings",
                        link: "/settings",
                        icon: "settings",
                    },
                ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton component={Link} href={item.link}>
                            <ListItemIcon>{AppIcons[item.icon]}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
}
