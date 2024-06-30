import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function UserManagement() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const handleDeleteUser = useCallback((userId) => {
        Swal.fire({
            title: "Are you sure you want to delete this user?",
            text: "You can also restore this user again.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .delete(`users/${userId}`)
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "The user has been deleted.",
                            "success"
                        );
                        fetchUsers();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error deleting the user.",
                            "error"
                        );
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    }, []);

    const handleRestoreUser = useCallback((userId) => {
        Swal.fire({
            title: "Are you sure you want to restore this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, restore it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axiosConfig
                    .put(`users/${userId}/restore`)
                    .then((response) => {
                        Swal.fire(
                            "Restored!",
                            "The user has been restored.",
                            "success"
                        );
                        fetchUsers();
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire(
                            "Error!",
                            "There was an error restoring the user.",
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
        { field: "name", headerName: "Name", flex: 1, minWidth: 100 },
        { field: "email", headerName: "Email", flex: 2, minWidth: 150 },
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
            minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        component={Link}
                        href={`/user-management/editor/${params.row.id}`}
                        color="secondary"
                        style={{ marginRight: 8 }}
                    >
                        Modify
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: 8 }}
                        onClick={() =>
                            params.row.deleted_at
                                ? handleRestoreUser(params.row.id)
                                : handleDeleteUser(params.row.id)
                        }
                    >
                        {params.row.deleted_at ? "Restore" : "Delete"}
                    </Button>
                </>
            ),
        },
    ];

    const fetchUsers = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get("users")
            .then((response) => {
                setUsers(response.data.data.users.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "User Management", icon: "whatshot" },
    ];

    const buttons = [
        {
            label: "Create new user",
            href: "/user-management/editor",
            icon: "grain",
        },
    ];

    return (
        <Layout links={links} buttons={buttons} title="Users">
            <Box>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    loading={loading}
                />
            </Box>
        </Layout>
    );
}
