import React from "react";
import { Box, Grid, TextField, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Parameters({
    parameters,
    handleParameterChange,
    addParameter,
    removeParameter,
}) {
    return (
        <Box mt={1}>
            <Grid container justifyContent={"end"} mb={2} spacing={1}>
                <Grid item xs={3}>
                    <Button
                        onClick={addParameter}
                        sx={{ marginTop: 1 }}
                        variant="contained"
                        fullWidth
                    >
                        Add Parameter
                    </Button>
                </Grid>
            </Grid>
            {parameters.map((param, index) => (
                <Box my={2} key={index}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <TextField
                                label="Key"
                                value={param.key}
                                onChange={(e) =>
                                    handleParameterChange(
                                        index,
                                        e.target.value,
                                        param.value
                                    )
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="Value"
                                value={param.value}
                                onChange={(e) =>
                                    handleParameterChange(
                                        index,
                                        param.key,
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                onClick={() => removeParameter(index)}
                                aria-label="delete"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}

export default Parameters;
