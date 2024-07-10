import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Select,
    MenuItem,
    Button,
    Tabs,
    Tab,
    TextField,
    Typography,
} from "@mui/material";
import Parameters from "./ApiBuilderElements/Parameters";
import Body from "./ApiBuilderElements/Body";
import Headers from "./ApiBuilderElements/Headers";
import axiosConfig from "../../../configs/AxiosConfig";
import InputAdornment from "@mui/material/InputAdornment";

function ApiBuilder({
    allowBody = true,
    allowParameters = true,
    allowHeaders = true,
    showPurposes = true,
    showApiDetails = true,
    showBaseURL = true,
    purpose,
    setPurpose,
    title,
    setTitle,
    description,
    setDescription,
    method,
    setMethod,
    endpoint,
    setEndpoint,
    headers,
    setHeaders,
    parameters,
    setParameters,
    bodyType,
    setBodyType,
    body,
    setBody,
    jsonBody,
    setJsonBody,
}) {
    const [baseURL, setBaseURL] = useState("/");
    const [tabIndex, setTabIndex] = useState(0);

    const [methods, setMethods] = useState([]);
    const [purposes, setPurposes] = useState([]);
    const [apiHeaders, setApiHeaders] = useState([]);
    const [dataTypes, setDataTypes] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);

    const handleHeaderChange = (index, key, value) => {
        const newHeaders = [...headers];
        newHeaders[index] = { key, value };
        setHeaders(newHeaders);
    };

    const handleJsonBodyChange = (edit) => {
        setJsonBody(edit.updated_src);
    };

    const handleBodyChange = (index, key, value) => {
        const newBody = [...body];
        newBody[index] = { key, value };
        setBody(newBody);
    };

    const handleParameterChange = (index, key, value) => {
        const newParameters = [...parameters];
        newParameters[index] = { key, value };
        setParameters(newParameters);
    };

    const handleBodyTypeChange = (value) => {
        setBodyType(value);
    };

    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const addParameter = () => {
        setParameters([...parameters, { key: "", value: "" }]);
    };

    const removeParameter = (index) => {
        const newParameters = [...parameters];
        newParameters.splice(index, 1);
        setParameters(newParameters);
    };

    const removeHeader = (index) => {
        const newHeaders = [...headers];
        newHeaders.splice(index, 1);
        setHeaders(newHeaders);
    };

    const addBody = () => {
        setBody([...body, { key: "", value: "" }]);
    };

    const removeBody = (index) => {
        const newBody = [...body];
        newBody.splice(index, 1);
        setBody(newBody);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const fetchAPIPreparation = () => {
        axiosConfig
            .get("apis/prepare")
            .then((response) => {
                setMethods(response.data.data.data.methods);
                setPurposes(response.data.data.data.api_purposes);
                setApiHeaders(response.data.data.data.headers);
                setDataTypes(response.data.data.data.data_types);
                setBodyTypes(response.data.data.data.body_types);
                setBaseURL(response.data.data.data.base_url);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchAPIPreparation();
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <Box mb={1}>
                {showApiDetails && (
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                )}
                {showPurposes && (
                    <Grid container my={2}>
                        <Grid item xs={12}>
                            <Select
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                displayEmpty
                                fullWidth
                                required
                            >
                                <MenuItem value="" disabled>
                                    Select Purpose
                                </MenuItem>
                                {purposes &&
                                    purposes.map((purpose, i) => (
                                        <MenuItem key={i} value={purpose.id}>
                                            <Typography variant="body1">
                                                {purpose.title} &nbsp;
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                {purpose.description}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </Grid>
                    </Grid>
                )}
            </Box>
            <Box>
                <Grid container mt={1} spacing={1}>
                    <Grid item xs={9}>
                        <TextField
                            label="Endpoint"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            fullWidth
                            required
                            InputProps={showBaseURL ? {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {baseURL}
                                    </InputAdornment>
                                ),
                            } : ""}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            displayEmpty
                            fullWidth
                            required
                        >
                            <MenuItem value="" disabled>
                                Method
                            </MenuItem>
                            {methods &&
                                methods.map((method, i) => (
                                    <MenuItem key={i} value={method.id}>
                                        {method.title}
                                    </MenuItem>
                                ))}
                        </Select>
                    </Grid>
                </Grid>
            </Box>

            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                sx={{ marginTop: 2 }}
            >
                {allowParameters && <Tab label="Parameters" />}
                {allowHeaders && <Tab label="Headers" />}
                {allowBody && <Tab label="Body" />}
            </Tabs>

            {allowParameters && tabIndex === 0 && (
                <Parameters
                    parameters={parameters}
                    handleParameterChange={handleParameterChange}
                    addParameter={addParameter}
                    removeParameter={removeParameter}
                />
            )}

            {allowHeaders && tabIndex === 1 && (
                <Headers
                    headers={headers}
                    apiHeaders={apiHeaders}
                    handleHeaderChange={handleHeaderChange}
                    addHeader={addHeader}
                    removeHeader={removeHeader}
                />
            )}

            {allowBody && tabIndex === 2 && (
                <Body
                    dataTypes={dataTypes}
                    bodyTypes={bodyTypes}
                    bodyType={bodyType}
                    handleBodyTypeChange={handleBodyTypeChange}
                    body={body}
                    handleBodyChange={handleBodyChange}
                    jsonBody={jsonBody}
                    handleJsonBodyChange={handleJsonBodyChange}
                    addBody={addBody}
                    removeBody={removeBody}
                />
            )}
        </form>
    );
}

export default ApiBuilder;
