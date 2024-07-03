import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "@inertiajs/react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import AppIcons from "../../configs/styles/AppIcons";

export default function BreadcrumbsElement({ links, buttons, mb }) {
    return (
        <Box role="presentation" mb={mb}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {links.map((link, index) => {
                            const isLast = index === links.length - 1;
                            const Icon = AppIcons[link.icon];

                            return isLast ? (
                                <Typography
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    color="text.primary"
                                >
                                    {Icon && React.cloneElement(Icon, { sx: { mr: 0.5 }, fontSize: "inherit" })}
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
                                    {Icon && React.cloneElement(Icon, { sx: { mr: 0.5 }, fontSize: "inherit" })}
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
