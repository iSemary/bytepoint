import React from "react";
import { Box, Grid, TextField, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreatableSelect from "react-select/creatable";
import ReactSelectDarkMode from "../../../../configs/styles/ReactSelectDarkMode";

function Headers({
    apiHeaders,
    headers,
    handleHeaderChange,
    addHeader,
    removeHeader,
    disabled = false
}) {
    const handleChange = (index, newValue, actionMeta) => {
        if (actionMeta.action === "create-option") {
            const createdHeader = {
                id: new Date().toISOString(),
                key: newValue.value,
                value: "",
            };
            handleHeaderChange(index, createdHeader);
        } else {
            handleHeaderChange(index, newValue);
        }
    };

    const options = apiHeaders.map((apiHeader) => ({
        value: apiHeader.id,
        label: apiHeader.title,
    }));

    return (
        <Box mt={1}>
            {addHeader && (
                <Grid container mb={2} justifyContent={"end"} spacing={1}>
                    <Grid item xs={3}>
                        <Button
                            onClick={addHeader}
                            sx={{ marginTop: 1 }}
                            variant="contained"
                            fullWidth
                        >
                            Add Header
                        </Button>
                    </Grid>
                </Grid>
            )}
            {headers.map((header, index) => (
                <Grid
                    container
                    my={2}
                    spacing={1}
                    alignItems="center"
                    key={index}
                >
                    <Grid item xs={6}>
                        <CreatableSelect
                            value={options.find(
                                (option) => option.label === header.key.label
                            )}
                            onChange={(newValue, actionMeta) =>
                                handleChange(index, newValue, actionMeta)
                            }
                            isDisabled={disabled}
                            options={options}
                            placeholder="Key"
                            isClearable
                            styles={ReactSelectDarkMode}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Value"
                            value={header.value}
                            onChange={(e) =>
                                handleHeaderChange(
                                    index,
                                    header.key,
                                    e.target.value
                                )
                            }
                            fullWidth
                        />
                    </Grid>
                    {removeHeader && (
                        <Grid item xs={2}>
                            <IconButton
                                onClick={() => removeHeader(index)}
                                aria-label="delete"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            ))}
        </Box>
    );
}

export default Headers;
