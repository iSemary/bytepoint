import React, { useEffect, useState } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import ReactJson from "react-json-view";
import DataObjectIcon from "@mui/icons-material/DataObject";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function Retrieve({ dataRepository, dataRepositoryValues, loading }) {
    const [dataRepositoryResponse, setDataRepositoryResponse] = useState({});
    const [jsonLoading, setJsonLoading] = useState(false);

    const handleDataRepositoryResponse = () => {
        if (dataRepositoryValues && dataRepositoryValues.length) {
            const data = [];

            const numEntries = dataRepositoryValues[0].data_values.length;
            for (let i = 0; i < numEntries; i++) {
                const entry = {};
                dataRepositoryValues.forEach((item) => {
                    entry[item.data_keys] = item.data_values[i] || "";
                });
                data.push(entry);
            }

            setDataRepositoryResponse({ data });
        } else {
            setDataRepositoryResponse({});
        }

        setJsonLoading(false);
    };

    useEffect(() => {
        setJsonLoading(true);
        handleDataRepositoryResponse();
    }, [dataRepository]);

    return (
        <Box>
            {loading && jsonLoading ? (
                <LinearProgress />
            ) : dataRepository?.id && dataRepositoryValues.length ? (
                <>
                    <Typography variant="h6" gutterBottom>
                        <Box display="flex" alignItems="center">
                            <DataObjectIcon sx={{ mr: 1 }} /> Json Example on
                            how it will work
                        </Box>
                    </Typography>
                    <ReactJson theme={"monokai"} src={dataRepositoryResponse} />
                </>
            ) : (
                <>
                    <Typography variant="body1" textAlign={"center"}>
                        <ErrorOutlineIcon textAlign={"center"} />
                    </Typography>
                    <Typography variant="body1" textAlign={"center"}>
                        Please make sure to select a data repository that
                        contains a valid data values to be retrieved
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default Retrieve;
