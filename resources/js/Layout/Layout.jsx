import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import BreadcrumbsElement from "./Elements/BreadcrumbsElement";
import { Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { useAuth } from "../providers/AuthProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { router } from "@inertiajs/react";

import "animate.css";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const lightTheme = createTheme({
    palette: {
        primary: {
            light: "#757ce8",
            main: "#3f50b5",
            dark: "#002884",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff7961",
            main: "#f44336",
            dark: "#ba000d",
            contrastText: "#000",
        },
    },
});

export default function Layout({
    children,
    links = [],
    buttons = [],
    actionButtons = [],
    title = null,
}) {
    const [open, setOpen] = useState(false);
    const { user, loading } = useAuth();

    const [userTheme, setUserTheme] = useState(false);
    const [leaving, setLeaving] = useState(null);

    useEffect(() => {
        setUserTheme(false);

        router.on("start", () => setLeaving(true));
        router.on("finish", () => setLeaving(false));
    }, [user]);

    return (
        <ThemeProvider theme={userTheme ? lightTheme : darkTheme}>
            <CssBaseline />
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <Header
                    user={user}
                    userLoading={loading}
                    open={open}
                    setOpen={setOpen}
                />
                <Sidebar
                    user={user}
                    userLoading={loading}
                    open={open}
                    setOpen={setOpen}
                />
                <Box component="main" flexGrow={1} p={2}>
                    <BreadcrumbsElement
                        mb={3}
                        links={links}
                        buttons={buttons}
                    />
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={6}>
                            {title ? (
                                <Typography my={2} variant="h4">
                                    {title}
                                </Typography>
                            ) : null}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {actionButtons.length > 0 && (
                                <Grid container justifyContent="flex-end">
                                    {actionButtons.map((button, index) => (
                                        <Grid item key={index}>
                                            <Button
                                                key={index}
                                                variant={
                                                    button.variant ||
                                                    "contained"
                                                }
                                                color={
                                                    button.color || "primary"
                                                }
                                                style={{
                                                    marginRight: "0.5rem",
                                                }}
                                                disabled={button.loading}
                                                onClick={button.onClick}
                                            >
                                                {button.loading ? (
                                                    <CircularProgress
                                                        size={24}
                                                    />
                                                ) : (
                                                    <>
                                                        {button.icon} &nbsp;{" "}
                                                        {button.label}
                                                    </>
                                                )}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <div
                        className={
                            "animate__animated " +
                            (leaving
                                ? "animate__zoomOut"
                                : "animate__fadeIn")
                        }
                    >
                        {children}
                    </div>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    );
}
