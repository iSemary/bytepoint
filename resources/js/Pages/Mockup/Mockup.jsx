import React, { useCallback, useEffect, useState } from "react";
import { Box, Checkbox, Grid, IconButton } from "@mui/material";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import postmanLogo from "../../assets/images/icons/postman.svg";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const Mockup = () => {
    const [urlId, setUrlId] = useState(null);

    const [mockups, setMockups] = useState([]);
    const [mockup, setMockup] = useState({});

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    // Handles the deletion of mockup with confirmation dialog
    const handleDelete = useCallback((id) => {
        Swal.fire({
            title: "Are you sure you want to delete this Mockup?",
            text: "You can also restore this Mockup again.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .delete(`mockups/${id}`)
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "The Mockup has been deleted.",
                            "success"
                        );
                        fetchMockups();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error deleting the Mockup.",
                            "error"
                        );
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    }, []);

    // Handles the restoration of a deleted mockup with confirmation dialog
    const handleRestore = useCallback((id) => {
        Swal.fire({
            title: "Are you sure you want to restore this Mockup?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, restore it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .put(`mockups/${id}/restore`)
                    .then((response) => {
                        Swal.fire(
                            "Restored!",
                            "The Mockup has been restored.",
                            "success"
                        );
                        fetchMockups();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error restoring the Mockup.",
                            "error"
                        );
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    }, []);

    // Fetches the list of mockups based on current page and pageSize
    const fetchMockups = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get(`mockups?page=${page + 1}&per_page=${pageSize}`)
            .then((response) => {
                setMockups(response.data.data.mockups.data);
                setTotalRows(response.data.data.mockups.total || 0);
            })
            .catch((error) => {
                setTotalRows(0);
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, pageSize]);

    // Triggers a refresh of the mockup list
    const handleRefresh = () => {
        fetchMockups();
    };

    useEffect(() => {
        fetchMockups();
    }, [fetchMockups]);

    // Parse URL and extract 'id' parameter on component mount
    useEffect(() => {
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");
        if (id) {
            setUrlId(id);
        }
    }, []);

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "title", headerName: "Title", width: 550, flex: 2 },
        { field: "description", headerName: "Description", flex: 2 },
        {
            field: "routing",
            headerName: "Routing",
            flex: 5,
            renderCell: (params) => (
                <Box display={"flex"} alignItems={"center"}>
                    <span>{params.row.mock_end_point}&nbsp;</span>
                    <DoubleArrowIcon mt={1} />&nbsp;
                    <span>{params.row.base_end_point}</span>
                </Box>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 2,
            minWidth: 250,
            width: "100%",
            renderCell: (params) => (
                <Box>
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
                </Box>
            ),
        },
    ];

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Mockups", icon: "mock_ups" },
    ];

    const buttons = [{ label: "Create new mockup", href: "/mock-ups/create" }];

    return (
        <Layout links={links} buttons={buttons} title="Mockups">
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
                    rows={mockups}
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
            </Box>
        </Layout>
    );
};

export default Mockup;
