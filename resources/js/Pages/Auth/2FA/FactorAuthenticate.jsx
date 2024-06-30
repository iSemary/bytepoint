import {
    Box,
    CircularProgress,
    Typography,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../../Layout/Layout";
import axiosConfig from "../../../configs/AxiosConfig";
import Alert from "../../../configs/Alert";
import { router } from "@inertiajs/react";

export default function FactorAuthenticate() {
    const [secretKey, setSecretKey] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    const fetch2FAData = () => {
        setLoading(true);

        axiosConfig
            .post("auth/2fa/generate")
            .then((response) => {
                setSecretKey(response.data.data.secret_key);
                setQrCode(response.data.data.qr_code);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        setVerifyLoading(true);
        axiosConfig
            .post("auth/2fa/verify", { code: code, secret_key: secretKey })
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                router.visit(`/`);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
            })
            .finally(() => {
                setVerifyLoading(false);
            });
    };

    useEffect(() => {
        fetch2FAData();
    }, []);

    return (
        <Layout>
            <Box mt={4} width={"70%"} mx={"auto"}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {qrCode ? (
                            <Box>
                                <Typography
                                    variant="h6"
                                    textAlign={"center"}
                                    mb={4}
                                >
                                    Scan this QR code with your authenticator
                                    app:
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} textAlign={"center"}>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: qrCode,
                                            }}
                                            style={{ marginBottom: "20px" }}
                                        />
                                        <Typography variant="body1">
                                            Or enter this secret key manually:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            {secretKey}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={fetch2FAData}
                                            style={{
                                                marginTop: "20px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            Refresh
                                        </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <form
                                            onSubmit={handleVerifyCode}
                                            style={{ textAlign: "center" }}
                                        >
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                            >
                                                Enter your 2FA code:
                                            </Typography>

                                            <Grid
                                                container
                                                spacing={2}
                                                alignItems="center"
                                            >
                                                <Grid item xs={9}>
                                                    <TextField
                                                        type="text"
                                                        value={code}
                                                        onChange={(e) =>
                                                            setCode(
                                                                e.target.value
                                                            )
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
                                                        disabled={verifyLoading}
                                                        fullWidth
                                                    >
                                                        {verifyLoading ? (
                                                            <CircularProgress
                                                                size={24}
                                                            />
                                                        ) : (
                                                            "Verify"
                                                        )}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : (
                            <Typography variant="body1">
                                Failed to load QR code and secret key. Please
                                try again.
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Layout>
    );
}
