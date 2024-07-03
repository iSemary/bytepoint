import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Box, IconButton, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosConfig from "../../configs/AxiosConfig";
import RefreshIcon from "@mui/icons-material/Refresh";
import ActivityLogModal from "./Elements/ActivityLogModal";

export default function ActivityLog() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [totalRows, setTotalRows] = useState(0);
    const [selectedRow, setSelectedRow] = useState({});

    const handleOpenDrawer = (row) => {
        setDrawerOpen(true);
        setSelectedRow(row);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
    };

    const fetchActivityLogs = useCallback(() => {
        setLoading(true);
        axiosConfig
            .get(`auth/activity-logs?page=${page + 1}&per_page=${pageSize}`)
            .then((response) => {
                setActivityLogs(response.data.data.activity_logs.data || []);
                setTotalRows(response.data.data.activity_logs.total || 0);
            })
            .catch((error) => {
                console.error(error);
                setActivityLogs([]);
                setTotalRows(0);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, pageSize]);

    const handleRefresh = () => {
        fetchActivityLogs();
    };

    useEffect(() => {
        fetchActivityLogs();
    }, [fetchActivityLogs]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Activity Log", icon: "activity_log" },
    ];

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "log_name", headerName: "Log Name", flex: 0.3 },
        { field: "description", headerName: "Event", flex: 0.3 },
        {
            field: "subject_type",
            headerName: "Subject Type",
            flex: 0.7,
            renderCall: (params) => {
                if (params.row && params.row.subject_type) {
                    return params.row.subject_type.split("\\").pop();
                }
                return "";
            },
        },
        {
            field: "subject_id",
            headerName: "Subject ID",
            renderCall: (params) => (params.row ? params.row.subject_id : ""),
        },
        {
            field: "causer_name",
            headerName: "Causer Name",
            flex: 1,
            renderCall: (params) => (params.row ? params.row.causer_name : ""),
        },
        {
            field: "created_at",
            headerName: "Created At",
            flex: 1,
        },
        {
            field: "properties",
            headerName: "Changes",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleOpenDrawer(params.row)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <Layout links={links} title="Activity Log">
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
                    rows={activityLogs}
                    columns={columns}
                    pagination
                    paginationMode="server"
                    rowCount={totalRows}
                    page={page}
                    autoPageSize
                    onPageSizeChange={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(0);
                    }}
                    loading={loading}
                    onPaginationModelChange={(params) => {
                        setPage(params.page);
                        setPageSize(params.pageSize);
                    }}
                />

                <ActivityLogModal
                    drawerOpen={drawerOpen}
                    selectedRow={selectedRow}
                    handleCloseDrawer={handleCloseDrawer}
                />
            </Box>
        </Layout>
    );
}
