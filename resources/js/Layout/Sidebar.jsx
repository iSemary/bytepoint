import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Link } from "@inertiajs/react";

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
                    { text: "Dashboard", link: "/", icon: <DashboardIcon /> },
                    { text: "APIs", link: "/apis", icon: <ApiIcon /> },
                    {
                        text: "Mock-Ups",
                        link: "/mock-ups",
                        icon: <MockupIcon />,
                    },
                    {
                        text: "Templates",
                        link: "/templates",
                        icon: <TemplateIcon />,
                    },
                    {
                        text: "Cloud Services",
                        link: "/cloud-services",
                        icon: <CloudIcon />,
                    },
                    {
                        text: "Data Repository",
                        link: "/data-repository",
                        icon: <DataIcon />,
                    },
                    {
                        text: "File Manager",
                        link: "/file-manager",
                        icon: <FileManagerIcon />,
                    },
                    { text: "Logs", link: "/logs", icon: <LogsIcon /> },
                    {
                        text: "Activity Log",
                        link: "/activity-log",
                        icon: <ManageAccountsIcon />,
                    },
                    {
                        text: "API Key Management",
                        link: "/api-key-management",
                        icon: <ApiKeyIcon />,
                    },
                    {
                        text: "User Management",
                        link: "/user-management",
                        icon: <UserIcon />,
                    },
                    {
                        text: "Settings",
                        link: "/settings",
                        icon: <SettingsIcon />,
                    },
                ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton component={Link} href={item.link}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
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
