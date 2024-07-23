import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Grid, TextField, Typography } from "@mui/material";
import AppIcons from "../../configs/styles/AppIcons";
import SaveIcon from "@mui/icons-material/Save";
import ReactJson from "react-json-view";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { router } from "@inertiajs/react";

export default function TemplateBuilder({ slug }) {
    const [template, setTemplate] = useState({});
    const [loading, setLoading] = useState(false);

    const [request, setRequest] = useState({});
    const [response, setResponse] = useState({});

    const [dataRepository, setDataRepository] = useState({
        title: "",
        description: "",
    });

    const [api, setApi] = useState({
        title: "",
        description: "",
        end_point: "",
    });

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Templates", href: "/templates/", icon: "templates" },
        { label: template?.title },
    ];

    useEffect(() => {
        axiosConfig
            .get(`templates/${slug}`)
            .then((response) => {
                setTemplate(response.data.data.template);
                setRequest(response.data.data.template.sample.request);
                setResponse(response.data.data.template.sample.response);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [slug]);

    const handleSubmit = () => {
        setLoading(true);

        const data = {
            data_repository_title: dataRepository.title,
            data_repository_description: dataRepository.description,
            end_point: api.title,
            api_title: api.description,
            api_description: api.end_point,
        };

        axiosConfig
            .post(`templates/${template.id}/store`, data)
            .then((response) => {
                Alert(response.data.message, "success", 5000);
                if (response.data.data.api.id)
                    router.visit(`/apis?id=${response.data.data.api.id}`);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 5000);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const actionButtons = [
        {
            label: "Save",
            onClick: handleSubmit,
            icon: <SaveIcon />,
            loading: loading,
        },
    ];

    return (
        <Layout
            title={`Template Builder | ${template?.title ?? ""}`}
            links={links}
            actionButtons={actionButtons}
        >
            {template && template.id ? (
                <Box>
                    <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        {AppIcons["data_repository"]}&nbsp;Data Repository
                        Configuration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Title"
                                name="title"
                                value={dataRepository.title}
                                onChange={(e) =>
                                    setDataRepository((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                multiline
                                label="Description"
                                name="description"
                                value={dataRepository.description}
                                onChange={(e) =>
                                    setDataRepository((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        {AppIcons["apis"]}&nbsp;API Configuration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                multiline
                                label="End Point"
                                name="end_point"
                                value={api.end_point}
                                onChange={(e) =>
                                    setApi((prev) => ({
                                        ...prev,
                                        end_point: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Title"
                                name="title"
                                value={api.title}
                                onChange={(e) =>
                                    setApi((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                multiline
                                label="Description"
                                name="description"
                                value={api.description}
                                onChange={(e) =>
                                    setApi((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        {AppIcons["json"]}&nbsp;Json Sample
                    </Typography>
                    <Grid container spacing={2} mt={0.4}>
                        <Grid item md={6}>
                            <Typography
                                variant="span"
                                sx={{ display: "flex", alignItems: "center" }}
                                mb={1}
                            >
                                <LoginIcon />
                                &nbsp;Request
                            </Typography>
                            <ReactJson
                                theme={"monokai"}
                                name={false}
                                src={request}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <Typography
                                variant="span"
                                sx={{ display: "flex", alignItems: "center" }}
                                mb={1}
                            >
                                <LogoutIcon />
                                &nbsp;Response
                            </Typography>
                            <ReactJson
                                theme={"monokai"}
                                name={false}
                                src={response}
                            />
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <LinearProgress />
            )}
        </Layout>
    );
}
