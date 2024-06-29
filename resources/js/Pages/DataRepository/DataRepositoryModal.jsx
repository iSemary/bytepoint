import React, { useEffect, useState } from "react";
import {
    IconButton,
    Drawer,
    Typography,
    Box,
    Divider,
    Paper,
} from "@mui/material";
import {
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";

const CustomDrawer = styled(Drawer)(({ theme, width }) => ({
    "& .MuiDrawer-paper": {
        width: width,
        maxWidth: "100%",
        transition: "width 0.3s",
    },
}));

export default function DataRepositoryModal({
    drawerOpen,
    dataRepository,
    dataRepositoryValues,
    handleCloseDrawer,
}) {
    const [drawerWidth, setDrawerWidth] = useState("700px");

    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const toggleDrawerWidth = () => {
        setDrawerWidth((prevWidth) =>
            prevWidth === "700px" ? "100%" : "700px"
        );
    };

    useEffect(() => {
        if (dataRepositoryValues && dataRepositoryValues.length > 0) {
            // Set up columns
            const columns = dataRepositoryValues.map((item) => ({
                field: item.data_keys,
                headerName: item.data_keys.charAt(0) + item.data_keys.slice(1),
                flex: 1,
            }));
            setColumns(columns);

            // Set up rows
            const rows = dataRepositoryValues[0].data_values.map((_, index) => {
                const row = {};
                dataRepositoryValues.forEach((item) => {
                    row[item.data_keys] = item.data_values[index];
                });
                return { id: index, ...row };
            });
            setRows(rows);
        } else {
            setRows([]);
            setColumns([]);
        }
    }, [dataRepositoryValues]);

    return (
        <CustomDrawer
            anchor="right"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            width={drawerWidth}
        >
            <Box width="100%">
                <Box
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                    m={1}
                >
                    <Box>
                        <IconButton
                            title={
                                drawerWidth === "700px" ? "Expand" : "Shrink"
                            }
                            onClick={toggleDrawerWidth}
                        >
                            {drawerWidth === "700px" ? (
                                <FullscreenIcon />
                            ) : (
                                <FullscreenExitIcon />
                            )}
                        </IconButton>
                        <IconButton title="Close" onClick={handleCloseDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                {dataRepository && (
                    <Box p={2} component={Paper} elevation={3} mx={2} my={3}>
                        <Typography variant="h6" gutterBottom>
                            Review Details
                        </Typography>
                        <Divider />
                        <table className="details-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            ID
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="body1">
                                            {dataRepository.id}
                                        </Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            Service
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="body1">
                                            {dataRepository.title}
                                        </Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            Type
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="body1">
                                            {dataRepository.type}
                                        </Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            Created At
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="body1">
                                            {dataRepository.created_at}
                                        </Typography>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {dataRepositoryValues && dataRepositoryValues.length ? (
                            <Box my={2}>
                                <Divider />
                                <Typography
                                    variant="h6"
                                    mb={1}
                                    mt={1}
                                >
                                    Data Repository Values
                                </Typography>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                page: 0,
                                                pageSize: 10,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                />
                            </Box>
                        ) : (
                            <p className="text-center">
                                <i>- No Data Values Yet -</i>
                            </p>
                        )}
                    </Box>
                )}
            </Box>
        </CustomDrawer>
    );
}
