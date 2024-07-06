import React from "react";
import Layout from "../../Layout/Layout";
import Lottie from "lottie-react";
import ocrAnimation from "../../assets/json/ocr-animation.json";
import CreationType from "../../Layout/Elements/CreationType";
import { Grid, Typography } from "@mui/material";

export default function CloudService() {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Cloud Services", icon: "cloud_services" },
    ];
    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Cloud Services
            </Typography>
            <Typography variant="body1" gutterBottom>
                Unlock the full potential of our integrated cloud services
            </Typography>
            <Grid container spacing={3}>
                <CreationType
                    text="OCR"
                    description="Transform your images into readable text with our powerful OCR API. Perfect for data extraction and document digitization."
                    url="/cloud-services/ocr"
                    icon={
                        <Lottie
                            animationData={ocrAnimation}
                            style={{ height: 200 }}
                            loop={true}
                        />
                    }
                    sm={4}
                />
            </Grid>
        </Layout>
    );
}
