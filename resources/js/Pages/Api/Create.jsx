import React, { useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Grid } from "@mui/material";
import ApiBuilder from "./Elements/ApiBuilder";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ApiController from "./Elements/ApiController";

const Create = () => {
    const [purpose, setPurpose] = useState("");

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Apis", href: "/apis", icon: "whatshot" },
        { label: "Create", icon: "grain" },
    ];

 
    return (
        <Layout links={links} title="Create New API">
            <Box container>
                <Grid container spacing={1}>
                    <Grid item xs={7}>
                        <Box mb={1}>
                            <Grid item xs={12}>
                                <Select
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem value="" disabled>
                                        Select Purpose
                                    </MenuItem>
                                    <MenuItem value="1">Retrieve Data</MenuItem>
                                    <MenuItem value="2">Store Data</MenuItem>
                                </Select>
                            </Grid>
                        </Box>
                        <ApiBuilder />
                    </Grid>
                    <Grid item xs={5}>
                        <ApiController purpose={purpose} />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Create;
