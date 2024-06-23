import React from 'react';
import { Box, Grid, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Parameters({ parameters, handleParameterChange, addParameter, removeParameter }) {
    return (
        <Box mt={1}>
            <Grid container spacing={1}>
                <Grid item xs={9}>
                    <h4>Parameters:</h4>
                </Grid>
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
                <div key={index}>
                    <TextField
                        label="Key"
                        value={param.key}
                        onChange={(e) =>
                            handleParameterChange(index, e.target.value, param.value)
                        }
                    />
                    <TextField
                        label="Value"
                        value={param.value}
                        onChange={(e) =>
                            handleParameterChange(index, param.key, e.target.value)
                        }
                    />
                    <IconButton onClick={() => removeParameter(index)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
        </Box>
    );
}

export default Parameters;
