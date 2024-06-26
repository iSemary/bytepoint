import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Layout from "../../Layout/Layout";
import { Link } from "@inertiajs/react";
import Select from "react-select";
import registerICO from "../../assets/images/icons/register.svg";
import axiosConfig from "../../configs/AxiosConfig";
import { Token } from "../../configs/Token";
import Alert from "../../configs/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [countryId, setCountryId] = useState("");
    const [customerTitle, setCustomerTitle] = useState("");
    const [customerUsername, setCustomerUsername] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [countryDialCode, setCountryDialCode] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle registration logic here
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        const data = {
            name: name,
            email: email,
            country_id: countryId.id,
            category_id: categoryId.id,
            customer_title: customerTitle,
            customer_username: customerUsername,
            password: password,
            password_confirmation: confirmPassword,
        };

        axiosConfig
            .post("auth/register", data)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                Token.store(response.data.data.user.access_token);
                setTimeout(() => {
                    window.location.href = response.data.data.redirect;
                }, 3000);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Get required data to register new account
    useEffect(() => {
        axiosConfig
            .get("categories")
            .then((response) => {
                setCategories(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axiosConfig
            .get("countries")
            .then((response) => {
                setCountries(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Layout>
            <Box>
                <Grid container sx={{ justifyContent: "center" }} spacing={2}>
                    <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        <img
                            src={registerICO}
                            width={350}
                            height={350}
                            alt="register icon"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            component="h1"
                            className="text-center"
                            variant="h5"
                        >
                            Sign Up
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} className="z-2">
                                    <Select
                                        options={countries}
                                        getOptionLabel={(option) =>
                                            option["name"]
                                        }
                                        getOptionValue={(option) =>
                                            option["id"]
                                        }
                                        value={countryId}
                                        onChange={(selectedOption) =>
                                            setCountryId(selectedOption)
                                        }
                                        placeholder="Country"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className="z-2">
                                    <Select
                                        options={categories}
                                        getOptionLabel={(option) =>
                                            option["title"]
                                        }
                                        getOptionValue={(option) =>
                                            option["id"]
                                        }
                                        value={categoryId}
                                        onChange={(selectedOption) =>
                                            setCategoryId(selectedOption)
                                        }
                                        placeholder="Category"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="customerTitle"
                                        label="Customer Title"
                                        name="customerTitle"
                                        autoComplete="customer-title"
                                        value={customerTitle}
                                        onChange={(e) =>
                                            setCustomerTitle(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="customerUsername"
                                        label="Customer Username"
                                        name="customerUsername"
                                        autoComplete="customer-username"
                                        value={customerUsername}
                                        onChange={(e) =>
                                            setCustomerUsername(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        autoComplete="current-password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Button
                                        component={Link}
                                        variant="body2"
                                        href="/login"
                                    >
                                        Already have an account? Sign in
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Register;
