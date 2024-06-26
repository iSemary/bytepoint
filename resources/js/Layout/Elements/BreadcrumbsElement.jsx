import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "@inertiajs/react";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

const iconMap = {
    home: <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    whatshot: <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    grain: <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
};

export default function BreadcrumbsElement({ links, buttons, mb }) {
    return (
        <Box role="presentation" mb={mb}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {links.map((link, index) => {
                            const isLast = index === links.length - 1;
                            const Icon = iconMap[link.icon];

                            return isLast ? (
                                <Typography
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    color="text.primary"
                                >
                                    {Icon}
                                    {link.label}
                                </Typography>
                            ) : (
                                <Link
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    href={link.href}
                                >
                                    {Icon}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                </Grid>
                <Grid item xs={6}>
                    {buttons && buttons.length > 0 && (
                        <Box display="flex" justifyContent="flex-end">
                            {buttons.map((button, index) => (
                                <Button
                                    key={index}
                                    component={Link}
                                    href={button.href}
                                    variant={button.variant || "contained"}
                                    color={button.color || "primary"}
                                    style={{ marginRight: "0.5rem" }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
