import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
    Grid,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";
import Select from "react-select";
import ReactSelectDarkMode from "../../configs/styles/ReactSelectDarkMode";
import SaveIcon from "@mui/icons-material/Save";

export default function Editor({ id }) {
    const [newId, setNewId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [countries, setCountries] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role_id: null,
        country_id: null,
        permissions: {},
    });

    const handleInputChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handlePermissionChange = (permissionId) => {
        setUser((prevUser) => {
            const updatedPermissions = { ...prevUser.permissions };
            if (updatedPermissions[permissionId]) {
                delete updatedPermissions[permissionId];
            } else {
                updatedPermissions[permissionId] = permissionId;
            }
            return { ...prevUser, permissions: updatedPermissions };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (id) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    const handleCreate = () => {
        axiosConfig
            .post("users", user)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                setNewId(response.data.data.user.id);
            })
            .catch((error) => {
                console.error(error);
                Alert(error.response.data.message, "error", 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUpdate = () => {
        axiosConfig
            .put(`users/${id}`, user)
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

    useEffect(() => {
        if (id) {
            axiosConfig
                .get(`users/${id}`)
                .then((response) => {
                    setUser(response.data.data.user);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (newId) {
            router.visit(`/user-management`);
        }
    }, [newId]);

    useEffect(() => {
        axiosConfig
            .get("countries")
            .then((response) => {
                setCountries(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axiosConfig
            .get("users/prepare")
            .then((response) => {
                setRoles(response.data.data.roles);
                setPermissions(response.data.data.permissions);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Users Management",
            href: "/user-management",
            icon: "user_management",
        },
        { label: "Editor" },
    ];

    const actionButtons = [
        {
            label: id ? "Update" : "Create",
            onClick: handleSubmit,
            icon: <SaveIcon />,
            loading: loading,
        },
    ];

    return (
        <Layout
            links={links}
            actionButtons={actionButtons}
            title={id ? "Edit User" : "Create New User"}
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
                            label="Name"
                            name="name"
                            value={user.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            value={user.email}
                            onChange={(e) =>
                                handleInputChange("email", e.target.value)
                            }
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={(e) =>
                                handleInputChange("password", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            label="Confirm Password"
                            name="password_confirmation"
                            type="password"
                            value={user.password_confirmation}
                            onChange={(e) =>
                                handleInputChange(
                                    "password_confirmation",
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Select
                            options={roles}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            styles={ReactSelectDarkMode}
                            value={
                                user.role_id
                                    ? roles.find(
                                          (role) => role.id === user.role_id
                                      )
                                    : null
                            }
                            onChange={(selectedOption) =>
                                handleInputChange(
                                    "role_id",
                                    selectedOption ? selectedOption.id : null
                                )
                            }
                            placeholder="Role"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Select
                            options={countries}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            styles={ReactSelectDarkMode}
                            value={
                                user.country_id
                                    ? countries.find(
                                          (country) =>
                                              country.id === user.country_id
                                      )
                                    : null
                            }
                            onChange={(selectedOption) =>
                                handleInputChange(
                                    "country_id",
                                    selectedOption ? selectedOption.id : null
                                )
                            }
                            placeholder="Country"
                        />
                    </Grid>
                </Grid>

                {/* Permissions Checkbox */}
                <Box mt={3}>
                    <InputLabel>Permissions</InputLabel>
                    <Grid container spacing={1}>
                        {permissions.map((permission) => (
                            <Grid item md={2} key={permission.id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                !!user.permissions[
                                                    permission.id
                                                ]
                                            }
                                            onChange={() =>
                                                handlePermissionChange(
                                                    permission.id
                                                )
                                            }
                                        />
                                    }
                                    label={permission.name
                                        .replace(/[._]/g, " ")
                                        .replace(/\w\S*/g, function (txt) {
                                            return (
                                                txt.charAt(0).toUpperCase() +
                                                txt.substr(1).toLowerCase()
                                            );
                                        })}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Layout>
    );
}
