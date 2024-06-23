import React, { useState } from "react";
import Box from "@mui/material/Box";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DataRepositoryModal from "./DataRepositoryModal";

const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title" },
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
        title: "Repository 1",
        type: "For Retrieve Data",
        createdAt: "2024-06-17T10:00:00Z",
    },
];

const links = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Data Repository", icon: "whatshot" },
];


const buttons = [
    { label: "Create new data repository", href: "/data-repository/create", icon: "grain" },
];

export default function DataRepository() {
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
        <Layout links={links} buttons={buttons} title="Data Repository">
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
                <DataRepositoryModal
                    drawerOpen={drawerOpen}
                    selectedRow={selectedRow}
                    handleCloseDrawer={handleCloseDrawer}
                />
            </Box>
        </Layout>
    );
}
