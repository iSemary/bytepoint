import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DataRepositoryModal from "./DataRepositoryModal";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "@inertiajs/react";

export default function DataRepository() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataRepositories, setDataRepositories] = useState([]);
    const [dataRepository, setDataRepository] = useState({});
    const [dataRepositoryValues, setDataRepositoryValues] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setDataRepository({});
    };

    const handleOpenDrawer = (row) => {
        setDrawerOpen(true);
        axiosConfig
            .get(`data-repositories/${row.id}`)
            .then((response) => {
                setDataRepository(response.data.data.data_repository);
                setDataRepositoryValues(
                    response.data.data.data_repository_values
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 1, minWidth: 50 },
        { field: "title", headerName: "Title", flex: 1, minWidth: 100 },
        { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
        {
            field: "created_at",
            headerName: "Created At",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 2,
            minWidth: 250,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 8 }}
                        onClick={() => handleOpenDrawer(params.row)}
                    >
                        View
                    </Button>
                    <Button
                        variant="contained"
                        component={Link}
                        href={`/data-repository/editor/${params.row.id}`}
                        color="secondary"
                        style={{ marginRight: 8 }}
                    >
                        Modify
                    </Button>
                    <Button
                        variant="contained"
                        component={Link}
                        href={`/data-repository/create-values/${params.row.id}/manual`}
                        color="secondary"
                        style={{ marginRight: 8 }}
                    >
                        Manage Values
                    </Button>
                </>
            ),
        },
    ];

    const fetchDataRepositories = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get(`data-repositories?page=${page + 1}&per_page=${pageSize}`)
            .then((response) => {
                setDataRepositories(response.data.data.data_repositories.data);
                setTotalRows(response.data.data.data_repositories.total || 0);
            })
            .catch((error) => {
                setTotalRows(0);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, pageSize]);

    const handleRefresh = () => {
        fetchDataRepositories();
    };

    useEffect(() => {
        fetchDataRepositories();
    }, [fetchDataRepositories]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Data Repository", icon: "whatshot" },
    ];

    const buttons = [
        {
            label: "Create new data repository",
            href: "/data-repository/editor",
            icon: "grain",
        },
    ];

    return (
        <Layout links={links} buttons={buttons} title="Data Repository">
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
                    rows={dataRepositories}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    loading={loading}
                    pagination
                    paginationMode="server"
                    rowCount={totalRows}
                    page={page}
                    autoPageSize
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(0);
                    }}
                    onPaginationModelChange={(params) => {
                        setPage(params.page);
                        setPageSize(params.pageSize);
                    }}
                />
                <DataRepositoryModal
                    drawerOpen={drawerOpen}
                    dataRepository={dataRepository}
                    dataRepositoryValues={dataRepositoryValues}
                    handleCloseDrawer={handleCloseDrawer}
                />
            </Box>
        </Layout>
    );
}
