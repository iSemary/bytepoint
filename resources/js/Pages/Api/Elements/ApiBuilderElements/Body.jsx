import React from "react";
import {
    Box,
    Grid,
    TextField,
    Button,
    IconButton,
    Tabs,
    Tab,
    Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import DeleteIcon from "@mui/icons-material/Delete";
import ReactJson from "react-json-view";
import { Help } from "@mui/icons-material";

function Body({
    dataTypes,
    bodyTypes,
    bodyType,
    handleBodyTypeChange,
    body,
    handleBodyChange,
    jsonBody,
    handleJsonBodyChange,
    addBody,
    removeBody,
    disabled = false,
}) {
    return (
        <Box mt={1}>
            <Tabs
                value={bodyType}
                onChange={(e, newValue) =>
                    disabled ? "" : handleBodyTypeChange(newValue)
                }
                variant="scrollable"
                scrollButtons="auto"
                sx={{ marginTop: 2 }}
            >
                {bodyTypes.map((type) => (
                    <Tab
                        key={type.id}
                        disabled={disabled && bodyType !== type.id ? true : false}
                        label={
                            <Box>
                                {type.title.replace(
                                    /^application\/|^multipart\//,
                                    ""
                                )}
                                {type.description && (
                                    <Tooltip title={type.description}>
                                        <IconButton size="small">
                                            <Help
                                                fontSize="11"
                                                color="#787878"
                                            />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        }
                        value={type.id}
                    />
                ))}
            </Tabs>
            <Box mt={2}>
                {bodyType === 3 && jsonBody ? (
                    <ReactJson
                        theme={"monokai"}
                        src={jsonBody}
                        onEdit={handleJsonBodyChange}
                        onDelete={handleJsonBodyChange}
                        onAdd={handleJsonBodyChange}
                    />
                ) : (
                    <>
                        {addBody && (
                            <Grid
                                container
                                justifyContent={"end"}
                                mb={2}
                                spacing={1}
                            >
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
                        )}
                        {body.map((item, index) => (
                            <Box my={2} key={index}>
                                <Grid container spacing={2}>
                                    <Grid item xs={5}>
                                        <TextField
                                            label="Key"
                                            disabled={disabled}
                                            value={item.key}
                                            onChange={(e) =>
                                                handleBodyChange(
                                                    index,
                                                    e.target.value,
                                                    item.value
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            label="Value"
                                            value={item.value}
                                            onChange={(e) =>
                                                handleBodyChange(
                                                    index,
                                                    item.key,
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    {removeBody && (
                                        <Grid item xs={2}>
                                            <IconButton
                                                onClick={() =>
                                                    removeBody(index)
                                                }
                                                aria-label="delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        ))}
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Body;
