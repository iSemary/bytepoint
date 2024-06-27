import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import ApiModal from "./ApiModal";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "@inertiajs/react";

export default function Apis() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apis, setApis] = useState([]);
    const [api, setApi] = useState({});

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setApi({});
    };

    const handleOpenDrawer = (row) => {
        setDrawerOpen(true);
        axiosConfig
            .get(`apis/${row.id}`)
            .then((response) => {
                setApi(response.data.data.api);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 1, minWidth: 50 },
        { field: "endPoint", headerName: "End Point", flex: 1, minWidth: 150 },
        { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
        {
            field: "purpose",
            headerName: "Purpose",
            flex: 1,
            minWidth: 200,
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
                        href={`/apis/edit/${params.row.id}`}
                        color="secondary"
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        component={Link}
                        href={`/apis/review/${params.row.id}`}
                        color="secondary"
                        style={{ marginRight: 8 }}
                    >
                        Review
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const fetchApis = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get("apis")
            .then((response) => {
                setApis(response.data.data.apis);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleRefresh = () => {
        fetchApis();
    };

    useEffect(() => {
        fetchApis();
    }, [fetchApis]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Apis", icon: "whatshot" },
    ];

    const buttons = [
        {
            label: "Create new API",
            href: "/apis/create",
            icon: "grain",
        },
    ];

    return (
        <Layout links={links} buttons={buttons} title="APIs">
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
                    rows={apis}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    loading={loading}
                />
                <ApiModal
                    drawerOpen={drawerOpen}
                    api={api}
                    handleCloseDrawer={handleCloseDrawer}
                />
            </Box>
        </Layout>
    );
}
