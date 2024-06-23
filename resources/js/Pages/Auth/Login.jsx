import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Layout from "../../Layout/Layout";
import { Link } from "@inertiajs/react";
import loginICO from "../../assets/images/icons/login.svg";
import { CircularProgress } from "@mui/material";
import { Token } from "../../configs/Token";
import Alert from "../../configs/Alert";
import axiosConfig from "../../configs/AxiosConfig";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [isSubdomainFromURL, setIsSubdomainFromURL] = useState(false);
    const [subdomain, setSubDomain] = useState(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);

        const data = {
            subdomain: subdomain,
            email: email,
            password: password,
        };

        axiosConfig
            .post("auth/login", data)
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

    useEffect(() => {
        const checkSubdomain = () => {
            const hostname = window.location.hostname;
            const parts = hostname.split(".");

            // Check if there's a subdomain
            if (parts.length > 2) {
                const possibleSubdomain = parts[0];
                // Ensure it's not 'www'
                if (possibleSubdomain !== "www") {
                    setIsSubdomainFromURL(true);
                    setSubDomain(possibleSubdomain);
                    return;
                }
            }

            // If we reach here, there's no subdomain
            setIsSubdomainFromURL(false);
            setSubDomain(null);
        };

        checkSubdomain();
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
                            src={loginICO}
                            width={350}
                            height={350}
                            alt="login icon"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography component="h1" variant="h5" align="center">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="subDomain"
                                label="Sub Domain"
                                name="subdomain"
                                autoComplete="subdomain"
                                autoFocus
                                value={subdomain}
                                disabled={isSubdomainFromURL}
                                onChange={(e) => setSubDomain(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
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
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
                                    "Sign In"
                                )}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Button href="#" variant="body2">
                                        Forgot password?
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        component={Link}
                                        variant="body2"
                                        href="/register"
                                    >
                                        {"Don't have an account? Sign Up"}
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

export default Login;
