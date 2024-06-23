import React from 'react';
import { Box, Grid, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Body({ body, handleBodyChange, addBody, removeBody }) {
    return (
        <Box mt={1}>
            <Grid container spacing={1}>
                <Grid item xs={9}>
                    <h4>Request Body:</h4>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        onClick={addBody}
                        sx={{ marginTop: 1 }}
                        variant="contained"
                        fullWidth
                    >
                        Add Body Item
                    </Button>
                </Grid>
            </Grid>
            {body.map((item, index) => (
                <div key={index}>
                    <TextField
                        label="Key"
                        value={item.key}
                        onChange={(e) =>
                            handleBodyChange(index, e.target.value, item.value)
                        }
                    />
                    <TextField
                        label="Value"
                        value={item.value}
                        onChange={(e) =>
                            handleBodyChange(index, item.key, e.target.value)
                        }
                    />
                    <IconButton onClick={() => removeBody(index)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
        </Box>
    );
}

export default Body;
