import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import { router } from '@inertiajs/react'

export default function Editor({ id }) {
    const [newId, setNewId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [types, setTypes] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const data = {
            title: title,
            description: description,
            type: type,
        };
        if (id) {
            handleUpdate(data);
        } else {
            handleCreate(data);
        }
    };

    const handleCreate = (data) => {
        axiosConfig
            .post("data-repositories", data)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                setNewId(response.data.data.data_repository.id);
            })
            .catch((error) => {
                console.error(error);
                Alert(error.response.data.message, "error", 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUpdate = (data) => {
        axiosConfig
            .put(`data-repositories/${id}`, data)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Data Repository",
            href: "/data-repository",
            icon: "data_repository",
        },
        { label: "Editor" },
    ];

    useEffect(() => {
        if (id) {
            axiosConfig
                .get(`data-repositories/${id}`)
                .then((response) => {
                    setTitle(response.data.data.data_repository.title);
                    setDescription(
                        response.data.data.data_repository.description
                    );
                    setType(response.data.data.data_repository.type);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (newId) {
            router.visit(`/data-repository/create-values/${newId}`);
        }
    }, [newId]);

    return (
        <Layout
            links={links}
            title={id ? "Edit Data Repository" : "Create New Data Repository"}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Title"
                    name="title"
                    value={title}
                    variant="outlined"
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Description"
                    name="description"
                    value={description}
                    variant="outlined"
                    multiline
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    fullWidth
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="Type"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="1">Type 1</MenuItem>
                        <MenuItem value="1">Type 2</MenuItem>
                        <MenuItem value="1">Type 3</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    className="w-fit-content"
                    variant="contained"
                    onClick={handleSubmit}
                    color="primary"
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : id ? (
                        "Update"
                    ) : (
                        "Create"
                    )}
                </Button>
            </Box>
        </Layout>
    );
}
