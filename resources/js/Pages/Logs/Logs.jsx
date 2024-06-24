import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import LogModal from "./LogModal";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Logs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [log, setLog] = useState({});
    const [loading, setLoading] = useState(false);

    const handleOpenDrawer = (row) => {
        setDrawerOpen(true);

        axiosConfig
            .get(`logs/${row._id}`)
            .then((response) => {
                setLog(response.data.data.log);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
    };

    const columns = [
        { field: "_id", headerName: "ID", flex: 1, minWidth: 100 },
        { field: "service", headerName: "Service", flex: 1, minWidth: 100 },
        { field: "title", headerName: "Title", flex: 2, minWidth: 200 },
        { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
        {
            field: "created_at",
            headerName: "Created At",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleOpenDrawer(params.row)}
                >
                    View
                </Button>
            ),
        },
    ];

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Logs", icon: "whatshot" },
    ];

    function getRowId(row) {
        return row._id;
    }

    const fetchLogs = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get("logs")
            .then((response) => {
                setLogs(response.data.data.logs.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleRefresh = () => {
        fetchLogs();
    };

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return (
        <Layout links={links} title="Logs">
            <Box my={4}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <IconButton
                        color="primary"
                        title="Refresh"
                        onClick={handleRefresh}
                        aria-label="refresh"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>
                <DataGrid
                    rows={logs}
                    getRowId={getRowId}
                    loading={loading}
                    columns={columns.map((column) =>
                        column.field === "action"
                            ? {
                                  ...column,
                                  renderCell: (params) => (
                                      <Button
                                          variant="contained"
                                          color="secondary"
                                          style={{ marginRight: 8 }}
                                          onClick={() =>
                                              handleOpenDrawer(params.row)
                                          }
                                      >
                                          View
                                      </Button>
                                  ),
                              }
                            : column
                    )}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
                <LogModal
                    drawerOpen={drawerOpen}
                    selectedRow={log}
                    handleCloseDrawer={handleCloseDrawer}
                />
            </Box>
        </Layout>
    );
}
