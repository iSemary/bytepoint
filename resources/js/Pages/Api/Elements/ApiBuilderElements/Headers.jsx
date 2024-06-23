import React from 'react';
import { Box, Grid, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Headers({ headers, handleHeaderChange, addHeader, removeHeader }) {
    return (
        <Box mt={1}>
            <Grid container spacing={1}>
                <Grid item xs={9}>
                    <h4>Headers:</h4>
                </Grid>
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
            {headers.map((header, index) => (
                <div key={index}>
                    <TextField
                        label="Key"
                        value={header.key}
                        onChange={(e) =>
                            handleHeaderChange(index, e.target.value, header.value)
                        }
                    />
                    <TextField
                        label="Value"
                        value={header.value}
                        onChange={(e) =>
                            handleHeaderChange(index, header.key, e.target.value)
                        }
                    />
                    <IconButton onClick={() => removeHeader(index)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
        </Box>
    );
}

export default Headers;
