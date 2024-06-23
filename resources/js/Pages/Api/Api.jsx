import React from "react";
import Box from "@mui/material/Box";
import Layout from "../../Layout/Layout";
import { Link } from "@inertiajs/react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const columns = [
    { field: "id", headerName: "ID" },
    { field: "endPoint", headerName: "End Point", width: 550 },
    { field: "type", headerName: "Type" },
    {
        field: "purpose",
        headerName: "Purpose",
        type: "string",
        width: 250,
    },
    {
        field: "action",
        headerName: "Action",
        sortable: false,
        width: "100%",
        renderCell: (params) => (
            <Box>
                <Link href={`/apis/edit/${params.row.id}`}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                </Link>
                <Link href={`/apis/review/${params.row.id}`}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: 8 }}
                    >
                        Review
                    </Button>
                </Link>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                >
                    Delete
                </Button>
            </Box>
        ),
    },
];

const rows = [
    { id: 1, type: "API", endPoint: "/users", purpose: "Fetch users" },
    { id: 2, type: "API", endPoint: "/posts", purpose: "Fetch posts" },
    { id: 3, type: "API", endPoint: "/comments", purpose: "Fetch comments" },
    {
        id: 4,
        type: "Database",
        endPoint: "users_table",
        purpose: "Store user data",
    },
    {
        id: 5,
        type: "Database",
        endPoint: "posts_table",
        purpose: "Store post data",
    },
    {
        id: 6,
        type: "Service",
        endPoint: "email_service",
        purpose: "Send emails",
    },
    {
        id: 7,
        type: "Service",
        endPoint: "payment_service",
        purpose: "Process payments",
    },
    { id: 8, type: "API", endPoint: "/login", purpose: "User login" },
    { id: 9, type: "API", endPoint: "/logout", purpose: "User logout" },
];

const links = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Apis", icon: "whatshot" },
];

const buttons = [
    { label: "Create new api", href: "/apis/create", icon: "grain" },
];

const Apis = () => {
    return (
        <Layout links={links} buttons={buttons} title="APIs">
            <Box my={4}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </Box>
        </Layout>
    );
};

export default Apis;
