import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import LogModal from "./LogModal";
import axiosConfig from "../../configs/AxiosConfig";

export default function Logs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [log, setLog] = useState({});

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
        { field: "_id", headerName: "ID" },
        { field: "service", headerName: "Service" },
        { field: "title", headerName: "Title" },
        { field: "type", headerName: "Type" },
        { field: "created_at", headerName: "Created At" },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleOpenDrawer(params.row)}
                >
                    Review
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

    useEffect(() => {
        axiosConfig
            .get("logs")
            .then((response) => {
                setLogs(response.data.data.logs.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Layout links={links} title="Logs">
            <Box my={4}>
                <DataGrid
                    rows={logs}
                    getRowId={getRowId}
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
