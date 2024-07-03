import React, { useEffect, useState } from "react";
import {
    Box,
    FormControlLabel,
    FormGroup,
    Grid,
    LinearProgress,
    Switch,
    Typography,
} from "@mui/material";
import ReactJson from "react-json-view";
import DataObjectIcon from "@mui/icons-material/DataObject";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";

function Retrieve({
    dataRepository,
    dataRepositoryValues,
    settings,
    setSettings,
    loading,
}) {
    const [dataRepositoryResponse, setDataRepositoryResponse] = useState({});
    const [jsonLoading, setJsonLoading] = useState(false);

    const handleSettingChange = (event) => {
        const { name, checked } = event.target;
        setSettings({ ...settings, [name]: checked });
    };

    const handleDataRepositoryResponse = () => {
        if (dataRepositoryValues && dataRepositoryValues.length) {
            const data = [];

            const numEntries = dataRepositoryValues[0].data_values.length;
            for (let i = 0; i < numEntries; i++) {
                const entry = {};
                dataRepositoryValues.forEach((item) => {
                    entry[item.data_keys] = item.data_values[i] || "";
                });
                data.push(entry);
            }

            setDataRepositoryResponse({ data });
        } else {
            setDataRepositoryResponse({});
        }

        setJsonLoading(false);
    };

    useEffect(() => {
        setJsonLoading(true);
        handleDataRepositoryResponse();
    }, [dataRepository]);

    return (
        <Box>
            {loading && jsonLoading ? (
                <LinearProgress />
            ) : dataRepository?.id && dataRepositoryValues.length ? (
                <>
                    {/* Response Settings */}
                    <Typography variant="h6" gutterBottom>
                        <Box display="flex" alignItems="center">
                            <SettingsInputComponentIcon sx={{ mr: 1 }} />{" "}
                            Response Settings
                        </Box>
                    </Typography>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.allow_counter}
                                            onChange={handleSettingChange}
                                            name="allow_counter"
                                        />
                                    }
                                    label="Count Data Set"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.allow_paginator}
                                            onChange={handleSettingChange}
                                            name="allow_paginator"
                                        />
                                    }
                                    label="Paginate Data Set"
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>

                    {/* Json Viewer */}
                    <Typography variant="h6" gutterBottom>
                        <Box display="flex" alignItems="center">
                            <DataObjectIcon sx={{ mr: 1 }} /> Json Example on
                            how it will work
                        </Box>
                    </Typography>
                    <ReactJson theme={"monokai"} src={dataRepositoryResponse} />
                </>
            ) : (
                <>
                    <Typography variant="body1" textAlign={"center"}>
                        <ErrorOutlineIcon textAlign={"center"} />
                    </Typography>
                    <Typography variant="body1" textAlign={"center"}>
                        Please make sure to select a data repository that
                        contains a valid data values to be retrieved
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default Retrieve;
