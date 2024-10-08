import React, { useCallback, useEffect, useState } from "react";
import { Box, Checkbox, Grid, IconButton, Typography } from "@mui/material";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import ApiRunModal from "./ApiRunModal";
import ApiDetailsModal from "./ApiDetailsModal";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import postmanLogo from "../../assets/images/icons/postman.svg";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Apis() {
    const [urlId, setUrlId] = useState(null);

    const [selectedIds, setSelectedIds] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);

    const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
    const [runDrawerOpen, setRunDrawerOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [apis, setApis] = useState([]);
    const [api, setApi] = useState({});

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    /** Multiple Select for api collection export */
    const handleSelectedIdsChange = (id) => (event) => {
        setSelectedIds((prevSelectedIds) => {
            if (event.target.checked) {
                return [...prevSelectedIds, id];
            } else {
                return prevSelectedIds.filter(
                    (selectedId) => selectedId !== id
                );
            }
        });
    };

    // Export Multiple Api for postman collection
    const handleExportPostmanCollection = () => {
        setExportLoading(true);
        axiosConfig
            .post(`apis/export/collection`, { ids: selectedIds })
            .then((response) => {
                const blob = new Blob(
                    [JSON.stringify(response.data.data.collection.original)],
                    {
                        type: "application/json",
                    }
                );
                saveAs(blob, `${response.data.data.name}.json`);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setExportLoading(false);
            });
    };

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

    const handleCopy = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log("Copied to clipboard!");
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        } else {
            console.error('Clipboard API not available');
        }
    };
    
    
    const columns = [
        {
            field: "#",
            headerName: "#",
            flex: 0.1,
            renderCell: (params) => (
                <Checkbox
                    checked={selectedIds.includes(params.row.id)}
                    onChange={handleSelectedIdsChange(params.row.id)}
                />
            ),
        },
        { field: "id", headerName: "ID", flex: 0.1, minWidth: 50 },
        {
            field: "end_point",
            headerName: "End Point",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Typography variant="body2" title="Click to copy to clipboard" pt={1.5}
                onClick={() => handleCopy(params.row.end_point)}

                 className="api-text">
                   <ContentCopyIcon style={{ fontSize:"14px" }} /> {params.row.end_point}
                </Typography>
            ),
        },
        {
            field: "method",
            headerName: "Method",
            flex: 0.2,
            minWidth: 100,
            renderCell: (params) => (
                <span display={"grid"} pt={1.5} className="method-text">
                    {params.row.method}
                </span>
            ),
        },
        {
            field: "is_authenticated",
            headerName: "Authenticated",
            renderCell: (params) => (
                <Box
                    display={"grid"}
                    pt={1.5}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {params.row.is_authenticated ? (
                        <LockIcon color="warning" title="Authenticated" />
                    ) : (
                        <LockOpenIcon color="success" title="Unauthenticated" />
                    )}
                </Box>
            ),
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0.5,
            minWidth: 150,
        },
        {
            field: "service",
            headerName: "Service",
            flex: 0.2,
            minWidth: 150,
        },
        {
            field: "data_repository_title",
            headerName: "Data Repository",
            flex: 0.5,
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
                        disabled={params.row.deleted_at ? true : false}
                        variant="contained"
                        color="success"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => handleOpenRunDrawer(params.row.id)}
                    >
                        Sample and Run
                    </Button>
                    <Button
                        disabled={params.row.deleted_at ? true : false}
                        color="primary"
                        size="small"
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
                        size="small"
                        component={Link}
                        href={`/apis/editor/${params.row.id}`}
                        style={{ marginRight: 8 }}
                    >
                        Modify
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
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
        const id = url.searchParams.get("id");
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
        { label: "Apis", icon: "apis" },
    ];

    const buttons = [
        {
            label: "Create new API",
            href: "/apis/create",
        },
    ];

    const actionButtons = [
        {
            label: (
                <>
                    <img src={postmanLogo} />
                    <span>&nbsp;Export Postman Collection</span>
                </>
            ),
            onClick: handleExportPostmanCollection,
            disabled: selectedIds.length === 0,
            icon: "",
            loading: exportLoading,
        },
    ];

    return (
        <Layout
            links={links}
            buttons={buttons}
            actionButtons={actionButtons}
            title="APIs"
        >
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
