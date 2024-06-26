import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Box,
    CircularProgress,
} from "@mui/material";
import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    keyColumn,
    floatColumn,
    intColumn,
    dateColumn,
    isoDateColumn,
} from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";
import Alert from "../../configs/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axiosConfig from "../../configs/AxiosConfig";
import SaveIcon from "@mui/icons-material/Save";

export default function Manual({ id }) {
    const [data, setData] = useState([]);

    const [columns, setColumns] = useState([]);

    const [key, setKey] = useState(0);

    const [loading, setLoading] = useState(false);

    const [newColumnType, setNewColumnType] = useState("");
    const [newColumnName, setNewColumnName] = useState("");
    const [selectedColumn, setSelectedColumn] = useState("");

    const [dataRepository, setDataRepository] = useState({});
    const [dataRepositoryValues, setDataRepositoryValues] = useState([]);

    const [dataTypes, setDataTypes] = useState([]);

    const handleColumnTypeChange = (event) => {
        setNewColumnType(event.target.value);
    };

    const handleColumnNameChange = (event) => {
        setNewColumnName(event.target.value);
    };

    const handleSelectColumnChange = (event) => {
        setSelectedColumn(event.target.value);
    };

    /**
     * Add new column to the data sheet
     */
    const addColumn = () => {
        if (!newColumnName) {
            Alert("Please enter a column name", "error", 5000);
            return;
        }

        const columnExists = columns.some(
            (column) => column.title === newColumnName
        );

        if (columnExists) {
            Alert("Column name already exists", "error", 5000);
            return;
        }

        const { columnType, defaultValue } = returnDataType(newColumnType);

        const newColumn = {
            ...keyColumn(newColumnName, columnType),
            title: newColumnName,
            data_type_id: newColumnType,
        };
        setColumns((prevColumns) => [...prevColumns, newColumn]);

        // Add default values for the new column in each row
        setData((prevData) =>
            prevData.map((row) => ({ ...row, [newColumnName]: defaultValue }))
        );

        // Force a re-render by updating the key
        setKey((prevKey) => prevKey + 1);
        setNewColumnName(""); // Clear the input field after adding the column
    };

    /**
     * Delete column from the data sheet
     */
    const deleteColumn = () => {
        const newColumns = columns.filter(
            (column) => column.title !== selectedColumn
        );
        const columnKeyToDelete = columns.find(
            (column) => column.title === selectedColumn
        )?.key;

        if (columnKeyToDelete) {
            const newData = data.map((row) => {
                const { [columnKeyToDelete]: _, ...rest } = row;
                return rest;
            });
            setData(newData);
        }

        setColumns(newColumns);
        setKey((prevKey) => prevKey + 1);
        setSelectedColumn("");
    };

    /**
     * Parse dates from json
     * @param {*} data
     * @param {*} columns
     * @returns
     */
    const parseDatesInData = (data, columns) => {
        return data.map((row) => {
            const parsedRow = { ...row };
            columns.forEach((column) => {
                if (column.data_type_id === 5) {
                    parsedRow[column.title] = new Date(parsedRow[column.title]);
                }
            });
            return parsedRow;
        });
    };

    /**
     * Return the data sheet type based on selected data type
     * @param {*} dataTypeId
     * @returns
     */
    const returnDataType = (dataTypeId) => {
        let columnType;
        let defaultValue;

        switch (dataTypeId) {
            case 1:
                columnType = textColumn;
                defaultValue = null;
                break;
            case 2:
                columnType = intColumn;
                defaultValue = 0;
                break;
            case 3:
                columnType = floatColumn;
                defaultValue = 0.0;
                break;
            case 4:
                columnType = checkboxColumn;
                defaultValue = false;
                break;
            case 5:
                columnType = dateColumn;
                defaultValue = null;
                break;
            case 6:
                columnType = isoDateColumn;
                defaultValue = null;
                break;
            default:
                columnType = textColumn;
                break;
        }

        return { columnType, defaultValue };
    };

    /**
     * Save data values for the data repository
     * @param {*} event
     */
    const handleSyncData = (event) => {
        event.preventDefault();
        setLoading(true);
        const payloadData = [];
        columns.forEach((column) => {
            const columnKey = column.title;
            const columnType = column.data_type_id;
            const values = data.map((row) => row[columnKey]);

            payloadData.push({
                key: columnKey,
                type: columnType,
                values: values,
            });
        });

        axiosConfig
            .post(`/data-repositories/${id}/fill`, { data: payloadData })
            .then((response) => {
                Alert(response.data.message, "success", 3000);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 3000);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        axiosConfig
            .get("data-types")
            .then((response) => {
                setDataTypes(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axiosConfig
            .get(`data-repositories/${id}`)
            .then((response) => {
                setDataRepository(response.data.data.data_repository);
                setDataRepositoryValues(
                    response.data.data.data_repository_values
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    useEffect(() => {
        if (dataRepositoryValues && dataRepositoryValues.length > 0) {
            // Create data array
            const data = dataRepositoryValues[0].data_values.map((_, index) => {
                const row = {};
                dataRepositoryValues.forEach((item) => {
                    row[item.data_keys] = item.data_values[index];
                });
                return row;
            });

            // Create columns array
            const columns = dataRepositoryValues.map((item) => {
                const { columnType } = returnDataType(item.data_type_id);

                return {
                    ...keyColumn(item.data_keys, columnType),
                    title: item.data_keys,
                    data_type_id: item.data_type_id,
                };
            });

            // Parse date strings into Date objects
            const parsedData = parseDatesInData(data, columns);
            setData(parsedData);

            setColumns(columns);
            setKey((prevKey) => prevKey + 1);
        } else {
            setData([]);
            setColumns([]);
            setKey((prevKey) => prevKey + 1);
        }
    }, [dataRepositoryValues]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        {
            label: "Data Repository",
            href: "/data-repository",
            icon: "whatshot",
        },
        { label: "Create", icon: "whatshot" },
        { label: dataRepository?.title },
        { label: "Manual", icon: "grain" },
    ];

    return (
        <Layout links={links} title="Manage Manual Values">
            <Grid
                container
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={2}
            >
                {/* Add Section */}
                <Grid item xs={12} md={4}>
                    <Grid
                        container
                        justifyContent={"space-between"}
                        spacing={3}
                    >
                        <Grid item xs={12} md={5}>
                            <FormControl fullWidth>
                                <InputLabel>Column Type</InputLabel>
                                <Select
                                    value={newColumnType}
                                    onChange={handleColumnTypeChange}
                                >
                                    <MenuItem value="">Column Type</MenuItem>
                                    {dataTypes &&
                                        dataTypes.map((dataType, index) => {
                                            return (
                                                <MenuItem
                                                    value={dataType.id}
                                                    key={index}
                                                >
                                                    {dataType.title}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Column Name"
                                value={newColumnName}
                                onChange={handleColumnNameChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={2}
                            sx={{ display: "grid", alignItems: "center" }}
                        >
                            <Button
                                variant="contained"
                                className="w-fit-content"
                                color="primary"
                                onClick={addColumn}
                            >
                                <AddIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Delete Section */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select Column</InputLabel>
                                <Select
                                    value={selectedColumn}
                                    onChange={handleSelectColumnChange}
                                >
                                    {columns.map((column) => (
                                        <MenuItem
                                            key={column.title}
                                            value={column.title}
                                        >
                                            {column.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={2}
                            sx={{ display: "grid", alignItems: "center" }}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                className="w-fit-content"
                                onClick={deleteColumn}
                            >
                                <DeleteIcon className="text-white" />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Save Section */}
                <Grid item xs={12} md={2}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSyncData}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <SaveIcon className="text-white" />
                        )}
                    </Button>
                </Grid>
            </Grid>
            <Box container my={3}>
                <DataSheetGrid
                    key={key}
                    value={data}
                    onChange={setData}
                    columns={columns}
                />
            </Box>
        </Layout>
    );
}
