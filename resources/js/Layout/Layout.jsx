import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import BreadcrumbsElement from "./Elements/BreadcrumbsElement";
import { Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { useAuth } from "../providers/AuthProvider";

export default function Layout({ children, links = [], buttons = [], title = null }) {
    const [open, setOpen] = useState(false);
    const { user, userLoading } = useAuth();

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header user={user} userLoading={userLoading} open={open} setOpen={setOpen} />
            <Sidebar user={user} userLoading={userLoading} open={open} setOpen={setOpen} />
            <Box component="main" flexGrow={1} p={2}>
                <BreadcrumbsElement mb={3} links={links} buttons={buttons} />
                {title ? (
                    <Typography my={2} variant="h4">
                        {title}
                    </Typography>
                ) : null}
                {children}
            </Box>
            <Footer />
        </Box>
    );
};
