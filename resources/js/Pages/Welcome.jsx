import React from "react";
import Layout from "../Layout/Layout";
import {
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from "@mui/material";
import { Link } from "@inertiajs/react";

function Welcome() {
    return (
        <Layout>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardActionArea component={Link} href="/apis">
                                <CardContent>
                                    <Typography variant="h4" component="div">
                                        APIs
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Consectetur asperiores
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardActionArea component={Link} href="/mock-ups">
                                <CardContent>
                                    <Typography variant="h4" component="div">
                                        Mock-Ups
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Consectetur asperiores
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}

export default Welcome;
