import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import axiosConfig from "../../../../configs/AxiosConfig";

export default function AITextArea({ generatedType }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [text, setText] = useState("");
    const [timing, setTiming] = useState(null);
    const [generatedText, setGeneratedText] = useState(null);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        let timerInterval = null;
        if (startTime !== null) {
            timerInterval = setInterval(updateTimer, 1); // Update timer every millisecond
        }
        return () => {
            clearInterval(timerInterval);
        };
    }, [startTime]);

    const updateTimer = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const milliseconds = Math.floor((elapsedTime % 1000) / 100); // Round to nearest 0.1 seconds
        setTiming(`${seconds}.${milliseconds}s`);
    };

    const handleEmojiSelect = (emoji) => {
        setText(text + emoji.native);
        setShowEmojiPicker(false);
    };

    const handleGenerate = () => {
        setTiming(null); // Reset timing when generating new text
        setGeneratedText(null);
        setStartTime(new Date().getTime()); // Start timing

        axiosConfig
            .post(`/generate`, { type: generatedType, text: text })
            .then((response) => {
                setGeneratedText(response.data.generatedText);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setStartTime(null); // Stop timing
            });
    };

    return (
        <Box

        >
            {showEmojiPicker && (
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            )}
            <TextField
                label="Enter your text here"
                multiline
                rows={6}
                variant="outlined"
                value={text}
                onChange={(e) => setText(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            😀
                        </span>
                    ),
                }}
                sx={{ width: "100%" }}
            />
            <Box sx={{ mt: 2 }}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        {timing && (
                            <Typography variant="body2">{timing}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6} textAlign={"right"}>
                        <Button
                            variant="contained"
                            onClick={handleGenerate}
                            color="primary"
                            disabled={startTime !== null}
                        >
                            Generate
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {generatedText && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Generated Text: {generatedText}
                </Typography>
            )}
        </Box>
    );
}
