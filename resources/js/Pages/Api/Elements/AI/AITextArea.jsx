import React, { useState } from "react";
import { TextField } from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function AITextArea() {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [text, setText] = useState("");

    const handleEmojiSelect = (emoji) => {
        setText(text + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <>
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
            {showEmojiPicker && (
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            )}
        </>
    );
}
