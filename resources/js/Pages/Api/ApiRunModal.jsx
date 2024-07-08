import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import {
    IconButton,
    Drawer,
    Typography,
    Box,
    Divider,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Grid,
    Button,
    CircularProgress,
    LinearProgress,
    Tabs,
    Tab,
} from "@mui/material";
import {
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import postmanLogo from "../../assets/images/icons/postman.svg";
import Body from "./Elements/ApiBuilderElements/Body";
import Headers from "./Elements/ApiBuilderElements/Headers";
import Parameters from "./Elements/ApiBuilderElements/Parameters";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import { saveAs } from "file-saver";

const CustomDrawer = styled(Drawer)(({ theme, width }) => ({
    "& .MuiDrawer-paper": {
        width: width,
        maxWidth: "100%",
        transition: "width 0.3s",
    },
}));

export default function ApiRunModal({
    runDrawerOpen,
    api,
    handleCloseRunDrawer,
}) {
    const baseWidth = "900px";
    const [tabIndex, setTabIndex] = useState(0);

    const [allowBody, setAllowBody] = useState(true);
    const [allowParameters, setAllowParameters] = useState(true);
    const [allowHeaders, setAllowHeaders] = useState(true);

    const [response, setResponse] = useState({
        message: "Run your awesome API first!",
    });

    const [dataTypes, setDataTypes] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);

    const [apiHeaders, setApiHeaders] = useState([]);

    const [drawerWidth, setDrawerWidth] = useState(baseWidth);
    const [runLoading, setRunLoading] = useState(false);
    const [exportPostmanCollectionLoading, setExportPostmanCollectionLoading] =
        useState(false);

    const toggleDrawerWidth = () => {
        setDrawerWidth((prevWidth) =>
            prevWidth === baseWidth ? "100%" : baseWidth
        );
    };

    const fetchAPIPreparation = () => {
        axiosConfig
            .get("apis/prepare")
            .then((response) => {
                setApiHeaders(response.data.data.data.headers);
                setDataTypes(response.data.data.data.data_types);
                setBodyTypes(response.data.data.data.body_types);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleRunAPI = () => {
        setResponse({ message: "Running your awesome API..." });
        setRunLoading(true);

        const data = {
            parameters: api.parameters,
            headers: api.headers,
            body: api.body,
        };

        axiosConfig
            .post(`apis/run/${api.id}`, data)
            .then((response) => {
                setResponse(response.data.data.response);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 5000);
                setResponse({ message: "Internal Server Error" });
                console.error(error);
            })
            .finally(() => {
                setRunLoading(false);
            });
    };

    const handleCancelAPI = () => {
        setResponse({ message: "Ops you canceled the API from running..." });
        setRunLoading(false);
    };

    const handleExportPostmanCollection = () => {
        setExportPostmanCollectionLoading(true);
        axiosConfig
            .post(`apis/export/${api.id}`)
            .then((response) => {
                const blob = new Blob([JSON.stringify(response.data)], {
                    type: "application/json",
                });
                saveAs(blob, `${api.title}.json`);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setExportPostmanCollectionLoading(false);
            });
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    useEffect(() => {
        fetchAPIPreparation();
    }, []);

    return (
        <CustomDrawer
            anchor="right"
            open={runDrawerOpen}
            onClose={handleCloseRunDrawer}
            width={drawerWidth}
        >
            <Box width="100%">
                <Box
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                    mb={2}
                >
                    <Box>
                        <IconButton
                            title="Close"
                            onClick={handleCloseRunDrawer}
                        >
                            <CloseIcon />
                        </IconButton>
                        <IconButton
                            title={
                                drawerWidth === baseWidth ? "Expand" : "Shrink"
                            }
                            onClick={toggleDrawerWidth}
                        >
                            {drawerWidth === baseWidth ? (
                                <FullscreenIcon />
                            ) : (
                                <FullscreenExitIcon />
                            )}
                        </IconButton>
                    </Box>
                </Box>
                {/* Run with sample section */}
                {api && (
                    <Box>
                        <Box
                            p={2}
                            component={Paper}
                            elevation={3}
                            mx={2}
                            my={1}
                        >
                            <Grid container mb={2}>
                                <Grid item md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Run & Test API
                                    </Typography>
                                </Grid>
                                <Grid item md={6} textAlign={"right"}>
                                    <Button
                                        disabled={
                                            exportPostmanCollectionLoading
                                        }
                                        onClick={handleExportPostmanCollection}
                                        variant="contained"
                                        className={
                                            exportPostmanCollectionLoading
                                                ? ""
                                                : "export-btn"
                                        }
                                    >
                                        {exportPostmanCollectionLoading ? (
                                            <>
                                                <CircularProgress
                                                    style={{
                                                        color: "#ffffff91",
                                                    }}
                                                    size={20}
                                                />{" "}
                                                &nbsp; Exporting
                                            </>
                                        ) : (
                                            <>
                                                <img src={postmanLogo} />
                                                &nbsp;Export Postman Collection
                                            </>
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box mb={1}>
                                <Grid container spacing={2}>
                                    <Grid item md={10}>
                                        <TextField
                                            fullWidth
                                            label={"End Point"}
                                            variant="standard"
                                            value={api.url}
                                            disabled={true}
                                            onClick={() =>
                                                handleCopyToClipboard(api.url)
                                            }
                                        />
                                    </Grid>
                                    <Grid item md={2} display={"grid"}>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                runLoading
                                                    ? handleCancelAPI()
                                                    : handleRunAPI()
                                            }
                                            color={
                                                runLoading ? "error" : "primary"
                                            }
                                        >
                                            {runLoading ? (
                                                <>
                                                    <CircularProgress
                                                        style={{
                                                            color: "#ffffff91",
                                                        }}
                                                        size={20}
                                                    />{" "}
                                                    &nbsp; Cancel
                                                </>
                                            ) : (
                                                "Run"
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Box my={3}>
                                    {runLoading ? <LinearProgress /> : ""}
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            p={2}
                            component={Paper}
                            elevation={3}
                            mx={2}
                            my={1}
                        >
                            <Typography variant="h6" gutterBottom>
                                API Configuration
                            </Typography>
                            <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                sx={{ marginTop: 2 }}
                            >
                                {allowParameters && <Tab label="Parameters" />}
                                {allowHeaders && <Tab label="Headers" />}
                                {allowBody && <Tab label="Body" />}
                            </Tabs>

                            {allowParameters &&
                                api.parameters &&
                                tabIndex === 0 && (
                                    <Parameters
                                        parameters={api.parameters}
                                        disabled={true}
                                        // handleParameterChange={handleParameterChange}
                                    />
                                )}

                            {allowHeaders && api.headers && tabIndex === 1 && (
                                <Headers
                                    headers={api.headers}
                                    apiHeaders={apiHeaders}
                                    // handleHeaderChange={handleHeaderChange}
                                    disabled={true}
                                />
                            )}

                            {allowBody && api.headers && tabIndex === 2 && (
                                <Body
                                    bodyTypes={bodyTypes}
                                    bodyType={api.body_type_id}
                                    body={api.body}
                                    // handleBodyChange={handleBodyChange}
                                    jsonBody={api?.jsonBody}
                                    disabled={true}
                                    // handleJsonBodyChange={handleJsonBodyChange}
                                />
                            )}
                        </Box>
                    </Box>
                )}
                {api && (
                    <Box p={2} component={Paper} elevation={3} mx={2} my={1}>
                        <Typography variant="h6" gutterBottom>
                            Response
                        </Typography>
                        <ReactJson
                            theme={"monokai"}
                            name={false}
                            src={response}
                        />
                    </Box>
                )}
                {/* Review Details Section */}
                {api && (
                    <Box p={2} component={Paper} elevation={3} mx={2} my={1}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="review-details-content"
                                id="review-details-header"
                            >
                                <Typography variant="h6" gutterBottom>
                                    API Details
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Divider />
                                <table className="details-table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    ID
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.id}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    Title
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.title}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    Description
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.description}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    End Point
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.end_point}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    Method
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.method}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    Type
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.type}
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    Created At
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body1">
                                                    {api.created_at}
                                                </Typography>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                )}
            </Box>
        </CustomDrawer>
    );
}
