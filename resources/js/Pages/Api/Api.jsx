import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import ApiRunModal from "./ApiRunModal";
import ApiDetailsModal from "./ApiDetailsModal";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Apis() {    
    const [urlId, setUrlId] = useState(null);

    const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
    const [runDrawerOpen, setRunDrawerOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [apis, setApis] = useState([]);
    const [api, setApi] = useState({});

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    // Closes the details drawer and resets the API state
    const handleCloseDetailsDrawer = () => {
        setDetailsDrawerOpen(false);
        setApi({});
    };

    // Opens the details drawer and fetches API details for the given id
    const handleOpenDetailsDrawer = (id) => {
        setDetailsDrawerOpen(true);
        axiosConfig
            .get(`apis/${id}`)
            .then((response) => {
                setApi(response.data.data.api);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Closes the run drawer and resets the API state
    const handleCloseRunDrawer = () => {
        setRunDrawerOpen(false);
        setApi({});
    };

    // Opens the run drawer and fetches API sample data for the given id
    const handleOpenRunDrawer = (id) => {
        setRunDrawerOpen(true);
        axiosConfig
            .get(`apis/${id}/sample`)
            .then((response) => {
                setApi(response.data.data.api);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Handles the deletion of an API with confirmation dialog
    const handleDelete = useCallback((id) => {
        Swal.fire({
            title: "Are you sure you want to delete this API?",
            text: "You can also restore this api again.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .delete(`apis/${id}`)
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "The API has been deleted.",
                            "success"
                        );
                        fetchApis();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error deleting the API.",
                            "error"
                        );
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    }, []);

    // Handles the restoration of a deleted API with confirmation dialog
    const handleRestore = useCallback((id) => {
        Swal.fire({
            title: "Are you sure you want to restore this API?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, restore it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .put(`apis/${id}/restore`)
                    .then((response) => {
                        Swal.fire(
                            "Restored!",
                            "The API has been restored.",
                            "success"
                        );
                        fetchApis();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error restoring the API.",
                            "error"
                        );
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    }, []);

    const columns = [
        { field: "id", headerName: "ID", flex: 1, minWidth: 50 },
        { field: "end_point", headerName: "End Point", flex: 1, minWidth: 150 },
        { field: "method", headerName: "Method", flex: 1, minWidth: 100 },
        {
            field: "type",
            headerName: "type",
            flex: 0.5,
            minWidth: 200,
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 3,
            minWidth: 250,
            renderCell: (params) => (
                <>
                    <Button
                        disabled={params.row.deleted_at ? true : false}
                        variant="contained"
                        color="success"
                        style={{ marginRight: 8 }}
                        onClick={() => handleOpenRunDrawer(params.row.id)}
                    >
                        Sample and Run
                    </Button>
                    <Button
                        disabled={params.row.deleted_at ? true : false}
                        color="primary"
                        variant="contained"
                        style={{ marginRight: 8 }}
                        onClick={() => handleOpenDetailsDrawer(params.row.id)}
                    >
                        View Details
                    </Button>
                    <Button
                        disabled={params.row.deleted_at ? true : false}
                        variant="contained"
                        color="primary"
                        component={Link}
                        href={`/apis/editor/${params.row.id}`}
                        style={{ marginRight: 8 }}
                    >
                        Modify
                    </Button>
                    <Button
                        variant="contained"
                        color={params.row.deleted_at ? "secondary" : "error"}
                        style={{ marginRight: 8 }}
                        onClick={() =>
                            params.row.deleted_at
                                ? handleRestore(params.row.id)
                                : handleDelete(params.row.id)
                        }
                    >
                        {params.row.deleted_at ? "Restore" : "Delete"}
                    </Button>
                </>
            ),
        },
    ];

    // Fetches the list of APIs based on current page and pageSize
    const fetchApis = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get(`apis?page=${page + 1}&per_page=${pageSize}`)
            .then((response) => {
                setApis(response.data.data.apis.data);
                setTotalRows(response.data.data.apis.total || 0);
            })
            .catch((error) => {
                setTotalRows(0);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, pageSize]);

    // Triggers a refresh of the API list
    const handleRefresh = () => {
        fetchApis();
    };

    useEffect(() => {
        fetchApis();
    }, [fetchApis]);

    // Parse URL and extract 'id' parameter on component mount
    useEffect(() => {
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        if (id) {
            setUrlId(id);
        }
    }, []);

    // Open run drawer when urlId is set
    useEffect(() => {
        if (urlId) {
            handleOpenRunDrawer(urlId);
        }
    }, [urlId]);

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
                <ApiDetailsModal
                    detailsDrawerOpen={detailsDrawerOpen}
                    api={api}
                    handleCloseDetailsDrawer={handleCloseDetailsDrawer}
                />
                <ApiRunModal
                    runDrawerOpen={runDrawerOpen}
                    api={api}
                    handleCloseRunDrawer={handleCloseRunDrawer}
                />
            </Box>
        </Layout>
    );
}
