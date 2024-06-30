import React, { useState } from "react";
import ReactJson from "react-json-view";
import { IconButton, Drawer, Typography, Box, Paper } from "@mui/material";
import {
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const CustomDrawer = styled(Drawer)(({ theme, width }) => ({
    "& .MuiDrawer-paper": {
        width: width,
        maxWidth: "100%",
        transition: "width 0.3s",
    },
}));

export default function ActivityLogModal({
    drawerOpen,
    selectedRow,
    handleCloseDrawer,
}) {
    const [drawerWidth, setDrawerWidth] = useState("700px");

    const toggleDrawerWidth = () => {
        setDrawerWidth((prevWidth) =>
            prevWidth === "700px" ? "100%" : "700px"
        );
    };

    return (
        <CustomDrawer
            anchor="right"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            width={drawerWidth}
        >
            <Box width="100%">
                <Box
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                    mb={2}
                >
                    <Box>
                        <IconButton title="Close" onClick={handleCloseDrawer}>
                            <CloseIcon />
                        </IconButton>
                        <IconButton
                            title={
                                drawerWidth === "700px" ? "Expand" : "Shrink"
                            }
                            onClick={toggleDrawerWidth}
                        >
                            {drawerWidth === "700px" ? (
                                <FullscreenIcon />
                            ) : (
                                <FullscreenExitIcon />
                            )}
                        </IconButton>
                    </Box>
                </Box>
                {selectedRow && (
                    <Box p={2} component={Paper} elevation={3} mx={2} my={3}>
                        <Typography variant="h6" gutterBottom>
                            Activity Log Details
                        </Typography>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                color="textSecondary"
                            >
                                Details
                            </Typography>
                            <ReactJson
                                theme={"monokai"}
                                src={selectedRow.properties}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </CustomDrawer>
    );
}
