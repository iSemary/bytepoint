import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Attempts() {
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState([]);

    const fetchAttempts = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get("auth/attempts")
            .then((response) => {
                setAttempts(response.data.data.attempts.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleRefresh = () => {
        fetchAttempts();
    };

    useEffect(() => {
        fetchAttempts();
    }, [fetchAttempts]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Attempts", icon: "whatshot" },
    ];

    const columns = [
        { field: "id", headerName: "ID", flex: 1, minWidth: 100 },
        { field: "ip", headerName: "IP Address", flex: 1, minWidth: 100 },
        { field: "agent", headerName: "Device", flex: 2, minWidth: 200 },
        {
            field: "created_at",
            headerName: "Created At",
            flex: 1,
            minWidth: 150,
        },
    ];

    return (
        <Layout links={links} title="Attempts">
            <Box>
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
                    rows={attempts}
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
