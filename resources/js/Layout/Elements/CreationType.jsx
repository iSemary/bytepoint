import React from "react";
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from "@mui/material";
import { Link } from "@inertiajs/react";

function CreationType({ text, description, url, icon, sm = 6, xs = 12 }) {
    return (
        <Grid item xs={xs} sm={sm}>
            <Card>
                <CardActionArea component={Link} href={url}>
                    <CardContent>
                        <Typography variant="h4" component="div">
                            {icon} {text}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

export default CreationType;
