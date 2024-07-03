import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import { Dropzone, FileMosaic } from "@files-ui/react";
import * as XLSX from "xlsx";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "../../configs/Alert";
import { router } from "@inertiajs/react";

export default function Import({ id }) {
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [dataRepository, setDataRepository] = useState({});
    const [file, setFile] = useState(null);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

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

    /**
     * Save File and render it as table
     * @param {*} files
     */
    const handleChangeFile = (files) => {
        const uploadedFile = files[0];
        setFile(uploadedFile);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // Get the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to array of arrays
            const excelData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            });

            // Separate headers (first row) and data rows
            const headers = excelData[0];
            const dataRows = excelData.slice(1);

            setColumns(headers);
            setRows(dataRows);
            setLoading(false);
        };

        reader.readAsArrayBuffer(uploadedFile.file);
    };

    /**
     * Save Excel File to the data repository values
     * @param {*} e
     */
    const handleSaveExcelFile = (e) => {
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

    
    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Data Repository",
            href: "/data-repository",
            icon: "data_repository",
        },
        { label: "Create"},
        { label: dataRepository?.title },
        { label: "Import" },
    ];

    const actionButtons = [
        {
            label: "Save Data Values",
            onClick: handleSaveExcelFile,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    return (
        <Layout
            links={links}
            title="Import Data Values"
            actionButtons={
                columns.length > 0 && rows.length > 0 ? actionButtons : ""
            }
        >
            <Grid
                container
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={2}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    mx={"auto"}
                    my={1}
                    width={"95%"}
                >
                    <Dropzone
                        onChange={handleChangeFile}
                        maxFiles={1}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        label="Drag'n drop data values file here"
                    >
                        {file ? <FileMosaic key={1} {...file} info /> : ""}
                    </Dropzone>
                </Box>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        Data Values based on the imported excel sheet
                    </Typography>
                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CircularProgress size={24} />
                        </Box>
                    ) : columns.length > 0 && rows.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="excel data table"
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
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            my={1}
                        >
                            <Typography>
                                There are no data imported yet
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Layout>
    );
}
