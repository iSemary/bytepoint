import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Grid, Typography, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ApiBuilder from "../Api/Elements/ApiBuilder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import ReactJson from "react-json-view";

const Manual = () => {
    const [purpose, setPurpose] = useState("");
    const [runningBase, setRunningBase] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [canRun, setCanRun] = useState(false);
    const [step, setStep] = useState(1);
    const [baseResponse, setBaseResponse] = useState({});

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [method, setMethod] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);
    const [parameters, setParameters] = useState([{ key: "", value: "" }]);
    const [body, setBody] = useState([{ key: "", value: "" }]);
    const [jsonBody, setJsonBody] = useState({});
    const [bodyType, setBodyType] = useState(1);

    const handleRunBaseAPI = () => {
        setRunningBase(true);

        const data = {
            method: method,
            endpoint: endpoint,
            base_headers: headers,
            base_parameters: parameters,
            base_body: body,
            jsonBody: jsonBody,
        };

        axiosConfig
            .post("mockups/run", data)
            .then((response) => {
                setBaseResponse(response.data.data.response);
                setStep(2);
            })
            .catch((error) => {
                setBaseResponse({
                    message:
                        error.response.data.message ?? "Something went wrong",
                });
                Alert(error.response.data.message, "error", 5000);
                setStep(1);
                console.error(error);
            })
            .finally(() => {
                setRunningBase(false);
            });
    };

    const handleSaveMockupAPI = () => {
        setLoadingSave(true);
    };

    useEffect(() => {
        if (method && endpoint) {
            setCanRun(true);
        } else {
            setCanRun(false);
        }
    }, [method, endpoint]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Mockups", href: "/mock-ups", icon: "mock_ups" },
        { label: "Create", href: "/mock-ups/create" },
        { label: "Manual" },
    ];

    const actionButtons = [
        {
            label: "Run",
            onClick: handleRunBaseAPI,
            loading: runningBase,
            icon: <PlayArrowIcon />,
            disabled: !canRun,
        },
        {
            label: "Save",
            onClick: handleSaveMockupAPI,
            loading: loadingSave,
            icon: <SaveIcon />,
            disabled: !canSave,
        },
    ];

    return (
        <Layout
            links={links}
            actionButtons={actionButtons}
            title="Create New Mockup"
        >
            <Typography variant="h6">Step 1: Run the base API</Typography>
            <Box container p={2} component={Paper}>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <ApiBuilder
                            showApiDetails={false}
                            showPurposes={false}
                            showBaseURL={false}
                            method={method}
                            setMethod={setMethod}
                            endpoint={endpoint}
                            setEndpoint={setEndpoint}
                            headers={headers}
                            setHeaders={setHeaders}
                            parameters={parameters}
                            setParameters={setParameters}
                            bodyType={bodyType}
                            setBodyType={setBodyType}
                            body={body}
                            setBody={setBody}
                            jsonBody={jsonBody}
                            setJsonBody={setJsonBody}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Typography>Base API Response:</Typography>
                        <ReactJson
                            src={baseResponse}
                            name={false}
                            theme={"monokai"}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Typography variant="h6" mt={2}>Step 2: Mock your API</Typography>
            <Box container p={2} component={Paper}>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <ApiBuilder
                            showApiDetails={false}
                            showPurposes={false}
                            showBaseURL={false}
                            method={method}
                            setMethod={setMethod}
                            endpoint={endpoint}
                            setEndpoint={setEndpoint}
                            headers={headers}
                            setHeaders={setHeaders}
                            parameters={parameters}
                            setParameters={setParameters}
                            bodyType={bodyType}
                            setBodyType={setBodyType}
                            body={body}
                            setBody={setBody}
                            jsonBody={jsonBody}
                            setJsonBody={setJsonBody}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Typography>Base API Response:</Typography>
                        <ReactJson
                            src={baseResponse}
                            name={false}
                            theme={"monokai"}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Manual;
