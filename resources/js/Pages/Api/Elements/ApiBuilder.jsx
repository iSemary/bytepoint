// ApiBuilder.js
import React, { useState } from "react";
import { Box, Grid, Select, MenuItem, Button, Tabs, Tab, TextField } from "@mui/material";
import Parameters from "./ApiBuilderElements/Parameters";
import Body from "./ApiBuilderElements/Body";
import Headers from "./ApiBuilderElements/Headers";

function ApiBuilder({
    allowBody = true,
    allowParameters = true,
    allowHeaders = true,
}) {
    const [endpoint, setEndpoint] = useState("");
    const [method, setMethod] = useState("");
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);
    const [parameters, setParameters] = useState([{ key: "", value: "" }]);
    const [body, setBody] = useState([{ key: "", value: "" }]);
    const [tabIndex, setTabIndex] = useState(0);

    const handleHeaderChange = (index, key, value) => {
        const newHeaders = [...headers];
        newHeaders[index] = { key, value };
        setHeaders(newHeaders);
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
        // Handle form submission here
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={9}>
                        <TextField
                            label="Endpoint"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="" disabled>
                                Method
                            </MenuItem>
                            <MenuItem value="GET">GET</MenuItem>
                            <MenuItem value="POST">POST</MenuItem>
                            <MenuItem value="PUT">PUT</MenuItem>
                            <MenuItem value="PATCH">PATCH</MenuItem>
                            <MenuItem value="DELETE">DELETE</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Box>

            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ marginTop: 2 }}>
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
                    handleHeaderChange={handleHeaderChange}
                    addHeader={addHeader}
                    removeHeader={removeHeader}
                />
            )}

            {allowBody && tabIndex === 2 && (
                <Body
                    body={body}
                    handleBodyChange={handleBodyChange}
                    addBody={addBody}
                    removeBody={removeBody}
                />
            )}

            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
                Send
            </Button>
        </form>
    );
}

export default ApiBuilder;
