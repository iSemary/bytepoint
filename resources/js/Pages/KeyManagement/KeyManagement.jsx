import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Layout from "../../Layout/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";
import { Tooltip } from "@mui/material";

export default function KeyManagement() {
    const [loading, setLoading] = useState(false);
    const [keys, setKeys] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    // Handles the deletion of an key with confirmation dialog
    const handleDelete = useCallback((id) => {
        Swal.fire({
            title: "Are you sure you want to revoke this Key?",
            text: "You can't restore this key anymore.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, revoke it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .delete(`keys/${id}`)
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "The Key has been revoked.",
                            "success"
                        );
                        fetchKeys();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error revoking the Key.",
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
        { field: "title", headerName: "Title", flex: 1, minWidth: 100 },
        {
            field: "expire_at_diff",
            headerName: "Expiration",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Tooltip title={params.row.expire_at ? new Date(params.row.expire_at * 1000).toLocaleString() : "Permanent"}>
                    <span>{params.value}</span>
                </Tooltip>
            ),
        },
        {
            field: "last_used_at",
            headerName: "Last Used",
            flex: 1,
            minWidth: 100,
        },
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
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color={params.row.deleted_at ? "secondary" : "error"}
                        style={{ marginRight: 8 }}
                        disabled={params.row.deleted_at ? true : false}
                        onClick={() => handleDelete(params.row.id)}
                    >
                        {params.row.deleted_at ? "Revoked" : "Revoke"}
                    </Button>
                </>
            ),
        },
    ];

    const fetchKeys = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get(`keys?page=${page + 1}&per_page=${pageSize}`)
            .then((response) => {
                setKeys(response.data.data.keys.data);
                setTotalRows(response.data.data.keys.total || 0);
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
        fetchKeys();
    };

    useEffect(() => {
        fetchKeys();
    }, [fetchKeys]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Keys Management", icon: "key_management" },
    ];

    const buttons = [
        {
            label: "Create new key",
            href: "/key-management/create",
        },
    ];

    return (
        <Layout links={links} buttons={buttons} title="Keys Management">
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
                    rows={keys}
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
}
