import { Box, Button, Typography } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosConfig from "../../../../configs/AxiosConfig";
import Select from "react-select";
import ReactSelectDarkMode from "../../../../configs/styles/ReactSelectDarkMode";
import DataRepositoryModal from "../../../DataRepository/DataRepositoryModal";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";

export default function DataRepositorySelector({
    title,
    dataRepository,
    setDataRepository,
    dataRepositoryValues,
    setDataRepositoryValues,
    loading,
    setLoading,
}) {
    const [keyword, setKeyword] = useState("");
    const [dataRepositories, setDataRepositories] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleOpenDrawer = (id) => {
        setDrawerOpen(true);
        
    };

    const fetchDataRepositories = () => {
        setLoading(true);
        axiosConfig
            .get("data-repositories", { params: { keyword, page } })
            .then((response) => {
                const newData = response.data.data.data_repositories.data;
                setDataRepositories((prevData) => [...prevData, ...newData]);
                setHasMore(
                    response.data.data.data_repositories.next_page_url !== null
                );
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDataRepositories();
    }, [keyword, page]);

    const handleRepositoryChange = (selectedOption) => {
        axiosConfig
            .get(`data-repositories/${selectedOption.id}`)
            .then((response) => {
                setDataRepository(response.data.data.data_repository);
                setDataRepositoryValues(
                    response.data.data.data_repository_values
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                <Box display="flex" alignItems="center">
                    <DatasetLinkedIcon sx={{ mr: 1 }} /> {title}
                </Box>
            </Typography>
            <Select
                options={dataRepositories}
                getOptionValue={(option) => option["id"]}
                getOptionLabel={(option) => option["title"]}
                onChange={handleRepositoryChange}
                value={dataRepository}
                styles={ReactSelectDarkMode}
                onInputChange={(inputValue) => setKeyword(inputValue)}
                placeholder="Select a data repository..."
                isClearable
                isSearchable
            />
            {dataRepository && dataRepository.id && (
                <Box mt={2} textAlign={"right"}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 8 }}
                        onClick={() => handleOpenDrawer(dataRepository.id)}
                    >
                        Review Data Repository
                    </Button>
                    <DataRepositoryModal
                        drawerOpen={drawerOpen}
                        dataRepository={dataRepository}
                        dataRepositoryValues={dataRepositoryValues}
                        handleCloseDrawer={handleCloseDrawer}
                    />
                </Box>
            )}
        </Box>
    );
}
