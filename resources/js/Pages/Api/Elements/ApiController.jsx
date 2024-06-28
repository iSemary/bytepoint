import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import Retrieve from "./Controller/Retrieve";
import Store from "./Controller/Store";
import DataRepositorySelector from "./Controller/DataRepositorySelector";

function ApiController({ purpose }) {
    const [dataRepository, setDataRepository] = useState({});
    const [dataRepositoryValues, setDataRepositoryValues] = useState({});
    const [loading, setLoading] = useState(false);

    return (
        <Box>
            {purpose == 1 ? (
                <>
                    <DataRepositorySelector
                        dataRepository={dataRepository}
                        setDataRepository={setDataRepository}
                        dataRepositoryValues={dataRepositoryValues}
                        setDataRepositoryValues={setDataRepositoryValues}
                        loading={loading}
                        setLoading={setLoading}
                        title="Choose on which data repository you want to retrieve the data from"
                    />
                    <Box mt={2}>
                        <Retrieve
                            dataRepository={dataRepository}
                            dataRepositoryValues={dataRepositoryValues}
                            loading={loading}
                        />
                    </Box>
                </>
            ) : purpose == 2 ? (
                <>
                    <DataRepositorySelector
                        dataRepository={dataRepository}
                        setDataRepository={setDataRepository}
                        dataRepositoryValues={dataRepositoryValues}
                        setDataRepositoryValues={setDataRepositoryValues}
                        loading={loading}
                        setLoading={setLoading}
                        title="Choose on which data repository you want to store your data"
                    />
                    <Box mt={2}>
                        <Store
                            dataRepository={dataRepository}
                            dataRepositoryValues={dataRepositoryValues}
                            loading={loading}
                        />
                    </Box>
                </>
            ) : (
                <Typography className="centered">
                    Please select the purpose of the API
                </Typography>
            )}
        </Box>
    );
}

export default ApiController;
