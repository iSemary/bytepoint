import React from "react";
import Layout from "../../Layout/Layout";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";

export default function Settings() {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Settings", icon: "whatshot" },
    ];

    return (
        <Layout links={links} title="Settings">
            <Container>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    aria-label="Settings tabs"
                    orientation="horizontal"
                >
                    <Tab label="Account Settings" />
                    <Tab label="Security & Privacy" />
                    <Tab label="Appearance & Customization" />
                </Tabs>
                <TabPanel value={selectedTab} index={0}>
                    {/* Account Settings */}
                    <Typography variant="h6">Account Settings</Typography>
                    <ul>
                        <li>Edit Profile</li>
                        <li>Change Password</li>
                        <li>Email Preferences</li>
                    </ul>
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    {/* Security & Privacy */}
                    <Typography variant="h6">Security & Privacy</Typography>
                    <ul>
                        <li>Two-Factor Authentication</li>
                        <li>Privacy Settings</li>
                    </ul>
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                    {/* Appearance & Customization */}
                    <Typography variant="h6">
                        Appearance & Customization
                    </Typography>
                    <ul>
                        <li>Theme Preferences</li>
                        <li>Customize Layout</li>
                    </ul>
                </TabPanel>
            </Container>
        </Layout>
    );
}
