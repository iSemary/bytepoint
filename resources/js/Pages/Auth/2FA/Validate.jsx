import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import Layout from "../../../Layout/Layout";
import axiosConfig from "../../../configs/AxiosConfig";
import Alert from "../../../configs/Alert";
import { router } from "@inertiajs/react";

export default function Validate() {
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValidateCode = (e) => {
        e.preventDefault();
        setLoading(true);
        axiosConfig
            .post("auth/2fa/validate", { code: code })
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                router.visit(`/`);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Layout>
            <Box>
                <Grid
                    container
                    justifyContent={"center"}
                    alignContent={"center"}
                >
                    <Grid item xs={4}>
                        <form
                            onSubmit={handleValidateCode}
                            style={{ textAlign: "center" }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Enter your 2FA code:
                            </Typography>

                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={9}>
                                    <TextField
                                        type="text"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        inputProps={{
                                            maxLength: 6,
                                        }}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        fullWidth
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            "Validate"
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}
