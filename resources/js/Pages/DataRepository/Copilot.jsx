import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";
import AITextArea from "../Api/Elements/AI/AITextArea";

export default function Copilot({ id }) {
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [dataRepository, setDataRepository] = useState({});
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [generatedText, setGeneratedText] = useState(null);

    /**
     * Save AI response to the data repository values
     * @param {*} e
     */
    const handleSaveAIData = (e) => {
        e.preventDefault();
        setSaveLoading(true);
        const payloadData = [];
        columns.forEach((column, index) => {
            const values = rows.map((row) => row[index]);
            payloadData.push({
                key: column,
                type: 1,
                values: values,
            });
        });

        axiosConfig
            .post(`/data-repositories/${id}/fill`, { data: payloadData })
            .then((response) => {
                Alert(response.data.message, "success", 3000);
                router.visit(`/data-repository/create-values/${id}/manual`);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
                setSaveLoading(false);
            });
    };

    /**
     * Get Data Repository
     */
    useEffect(() => {
        axiosConfig
            .get(`data-repositories/${id}`)
            .then((response) => {
                setDataRepository(response.data.data.data_repository);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    useEffect(() => {
        if (
            generatedText &&
            generatedText.data_repository &&
            generatedText.data_repository.length
        ) {
            const generatedDataRepository = generatedText.data_repository;
    
            // Extract column names from the first item in data_repository
            const newColumns = Object.keys(generatedDataRepository[0]);
            setColumns(newColumns);
    
            // Extract row data from all items in data_repository
            const newRows = generatedDataRepository.map((item) => {
                return newColumns.map((column) => item[column]);
            });
            setRows(newRows);
        } else {
            setRows([]);
            setColumns([]);
        }
    }, [generatedText]);
    

    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Data Repository",
            href: "/data-repository",
            icon: "data_repository",
        },
        { label: "Create" },
        { label: dataRepository?.title },
        { label: "Copilot" },
    ];

    const actionButtons = [
        {
            label: "Save Data Values",
            onClick: handleSaveAIData,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    return (
        <Layout
            links={links}
            title="Generate Data Values"
            actionButtons={
                columns.length > 0 && rows.length > 0 ? actionButtons : ""
            }
        >
            <Box container>
                <Typography my={1}>Step 1: Describe your needs</Typography>
                <AITextArea
                    type={1}
                    generatedText={generatedText}
                    setGeneratedText={setGeneratedText}
                />
                <br />
            </Box>
            {columns.length > 0 && rows.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Generated Data
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label="generated data table"
                        >
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell key={index}>
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Layout>
    );
}
