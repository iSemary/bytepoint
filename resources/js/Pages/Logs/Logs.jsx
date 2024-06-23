import React, { useState } from "react";
import Box from "@mui/material/Box";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import LogModal from "./LogModal";

const columns = [
    { field: "id", headerName: "ID" },
    { field: "service", headerName: "Service" },
    { field: "type", headerName: "Type" },
    { field: "createdAt", headerName: "Created At" },
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

const rows = [
    {
        id: 1,
        service: "API Mock-up",
        type: "info",
        json: [
            {
                key: "value",
            },
        ],
        createdAt: "2024-06-17T10:00:00Z",
    },
];

const links = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Logs", icon: "whatshot" },
];

export default function Logs() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleOpenDrawer = (row) => {
        setSelectedRow(row);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
    };

    return (
        <Layout links={links} title="Logs">
            <Box my={4}>
                <DataGrid
                    rows={rows}
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
                    selectedRow={selectedRow}
                    handleCloseDrawer={handleCloseDrawer}
                />
            </Box>
        </Layout>
    );
}
