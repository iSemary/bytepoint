import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "../../Layout/Layout";
import { Grid } from "@mui/material";
import ApiBuilder from "./Elements/ApiBuilder";
import ApiController from "./Elements/ApiController";
import SaveIcon from "@mui/icons-material/Save";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";

const Editor = ({ id }) => {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Apis", href: "/apis", icon: "whatshot" },
        { label: "Create", icon: "grain" },
    ];

    const [newId, setNewId] = useState(null);

    const [purpose, setPurpose] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);

    // Add new state variables
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [method, setMethod] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);
    const [parameters, setParameters] = useState([{ key: "", value: "" }]);
    const [bodyType, setBodyType] = useState(1);
    const [body, setBody] = useState([{ key: "", value: "" }]);
    const [settings, setSettings] = useState({
        allow_counter: true,
        allow_paginator: true,
    });
    const [jsonBody, setJsonBody] = useState({});

    const [dataRepository, setDataRepository] = useState({});
    const [defaultDataRepository, setDefaultDataRepository] = useState({});

    const handleFetchAPIDetails = (id) => {
        axiosConfig
            .get(`apis/${id}`)
            .then((response) => {
                setTitle(response.data.data.api.title);
                setDescription(response.data.data.api.description);
                setPurpose(response.data.data.api.type);
                setEndpoint(response.data.data.api.end_point);
                setMethod(response.data.data.api.method_id);

                setSettings(response.data.data.api.settings);

                setDataRepository(response.data.data.api.data_repository);
                setDefaultDataRepository(
                    response.data.data.api.data_repository
                );

                // setHeaders(response.data.data.api.headers);


                if (response.data.data.api.parameters.length)
                    setParameters(response.data.data.api.parameters);
                setBodyType(response.data.data.api.body_type_id);
                if (response.data.data.api.body.length)
                    setBody(response.data.data.api.body);
                
                // TODO add json body
                setJsonBody({});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSaveAPI = () => {
        setSaveLoading(true);

        const data = {
            title: title,
            description: description,
            purpose_id: purpose,
            method_id: method,
            end_point: endpoint,
            body_type_id: bodyType,
            headers: headers,
            parameters: parameters,
            data_repository_id: dataRepository?.id,
            body: bodyType === 1 ? body : jsonBody,
            settings: settings,
        };

        axiosConfig
            .post(`apis`, data)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                setNewId(response.data.data.api.id);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 5000);
                console.error(error);
            })
            .finally(() => {
                setSaveLoading(false);
            });
    };

    useEffect(() => {
        if (newId) {
            router.visit(`/apis?id=${newId}`);
        }
    }, [newId]);

    useEffect(() => {
        if (id) {
            handleFetchAPIDetails(id);
        }
    }, [id]);

    const actionButtons = [
        {
            label: id ? "Update" : "Save",
            onClick: handleSaveAPI,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    return (
        <Layout
            links={links}
            actionButtons={actionButtons}
            title="Create New API"
        >
            <Box container>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <ApiBuilder
                            purpose={purpose}
                            setPurpose={setPurpose}
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
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
                            dataRepository={dataRepository}
                            setDataRepository={setDataRepository}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ApiController
                            purpose={purpose}
                            dataRepository={dataRepository}
                            setDataRepository={setDataRepository}
                            settings={settings}
                            setSettings={setSettings}
                            defaultDataRepository={defaultDataRepository}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default Editor;
