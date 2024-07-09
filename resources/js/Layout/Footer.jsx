import React from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Footer = () => {
    return (
        <Box
            sx={{
                width: "100%",
                bottom: 0,
                color: "white",
                textAlign: "center",
                py: 2,
            }}
        >
            <Typography variant="body1">
                © {new Date().getFullYear()} BytePoint
            </Typography>
            <Typography variant="body2">
                <Link href="/" color="inherit" underline="hover">
                    Privacy Policy
                </Link>{" "}
                |{" "}
                <Link href="/" color="inherit" underline="hover">
                    Terms of Service
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;
