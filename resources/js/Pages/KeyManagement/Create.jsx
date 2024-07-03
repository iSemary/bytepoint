import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Grid, TextField, Box, Typography, Icon } from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";
import SaveIcon from "@mui/icons-material/Save";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Create() {
    const [loading, setLoading] = useState(false);

    const [key, setKey] = useState({
        title: "",
        key_value: "",
        expire_at: "",
    });

    const handleInputChange = (field, value) => {
        setKey({ ...key, [field]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        axiosConfig
            .post("keys", key)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                router.visit(`/key-management`);
            })
            .catch((error) => {
                console.error(error);
                Alert(error.response.data.message, "error", 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Keys Management",
            href: "/key-management",
            icon: "key_management",
        },
        { label: "Create" },
    ];

    const actionButtons = [
        {
            label: "Create",
            onClick: handleSubmit,
            icon: <SaveIcon />,
            loading: loading,
        },
    ];

    return (
        <Layout
            links={links}
            actionButtons={actionButtons}
            title={"Create New Key"}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="Title"
                            name="title"
                            value={key.title}
                            onChange={(e) =>
                                handleInputChange("title", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Expiration"
                                fullWidth
                                disablePast
                                value={key.expiration}
                                onChange={(newValue) =>
                                    handleInputChange("expire_at", newValue)
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 1,
                                }}
                            >
                                <InfoOutlinedIcon
                                    sx={{
                                        fontSize: "small",
                                        color: "text.secondary",
                                        mr: 0.5,
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Leave empty for permanently
                                </Typography>
                            </Box>{" "}
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            variant="outlined"
                            required
                            multiline
                            rows={6}
                            fullWidth
                            label="Key"
                            name="key_value"
                            value={key.key_value}
                            onChange={(e) =>
                                handleInputChange("key_value", e.target.value)
                            }
                        />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}
