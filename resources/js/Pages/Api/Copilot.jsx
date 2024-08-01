import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import axiosConfig from "../../configs/AxiosConfig";
import { Typography, Box } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";
import AITextArea from "../Api/Elements/AI/AITextArea";
import ApiBuilder from "./Elements/ApiBuilder";
import DataTable from "./Elements/DataTable";

export default function Copilot() {
    const [saveLoading, setSaveLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [generatedText, setGeneratedText] = useState(null);

    const [apiConfiguration, setApiConfiguration] = useState(null);

    const [title, setTitle] = useState("");
    const [purpose, setPurpose] = useState("");
    const [description, setDescription] = useState("");
    const [method, setMethod] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);
    const [parameters, setParameters] = useState([{ key: "", value: "" }]);
    const [bodyType, setBodyType] = useState(1);
    const [body, setBody] = useState([{ key: "", value: "" }]);
    const [jsonBody, setJsonBody] = useState({});

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Apis", href: "/apis", icon: "apis" },
        { label: "Create" },
        { label: "Copilot" },
    ];

    const actionButtons = [
        {
            label: "Save API",
            onClick: handleSaveAIData,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    useEffect(() => {
        processGeneratedText();
    }, [generatedText]);

    function processGeneratedText() {
        if (generatedText?.data_repository?.length) {
            processDataRepository();
        } else {
            setRows([]);
            setColumns([]);
        }

        if (generatedText?.api_configuration) {
            setApiConfiguration(generatedText.api_configuration);
            setTitle(generatedText.api_configuration.title);
            setDescription(generatedText.api_configuration.description);
            setEndpoint(
                generatedText.api_configuration.end_point.replace("/", "")
            );
            setPurpose(generatedText.api_configuration.type);
            setMethod(generatedText.api_configuration.method);
            setBody(generatedText.api_configuration.body);
        } else {
            setTitle("");
            setDescription("");
            setEndpoint("");
            setPurpose("");
            setMethod("");
            setBody([{ key: "", value: "" }]);
            setHeaders([{ key: "", value: "" }]);
            setParameters([{ key: "", value: "" }]);
        }
    }

    function processDataRepository() {
        const dataRepo = generatedText.data_repository;
        const newColumns = Object.keys(dataRepo[0]);
        setColumns(newColumns);
        setRows(
            dataRepo.map((item) => newColumns.map((column) => item[column]))
        );
    }

    function handleSaveAIData(e) {
        e.preventDefault();
        setSaveLoading(true);
        const dataRepository = columns.map((column, index) => ({
            key: column,
            type: 1,
            values: rows.map((row) => row[index]),
        }));

        axiosConfig
            .post(`apis/copilot/store`, {
                data_repository: dataRepository,
                api_configuration: {
                    title: title,
                    description: description,
                    purpose_id: purpose,
                    method_id: method,
                    end_point: endpoint,
                    body_type_id: bodyType,
                    headers: headers,
                    parameters: parameters,
                    body: body,
                },
            })
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                router.visit(`/apis?id=${response.data.data.api.id}`);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
                setSaveLoading(false);
            });
    }

    return (
        <Layout
            links={links}
            title="Generate API & Data Repository"
            actionButtons={
                columns.length > 0 && rows.length > 0 ? actionButtons : ""
            }
        >
            <Box container>
                <Typography my={1}>Describe your needs</Typography>
                <AITextArea type={2} setGeneratedText={setGeneratedText} />
                <br />

                {apiConfiguration?.title && (
                    <ApiBuilder
                        title={title}
                        purpose={purpose}
                        setPurpose={setPurpose}
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
                    />
                )}

                {columns.length > 0 && rows.length > 0 && (
                    <DataTable columns={columns} rows={rows} />
                )}
            </Box>
        </Layout>
    );
}
