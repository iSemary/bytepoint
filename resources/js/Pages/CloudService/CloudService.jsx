import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import Lottie from "lottie-react";
import ocrAnimation from "../../assets/json/ocr-animation.json";
import CreationType from "../../Layout/Elements/CreationType";
import { Grid, Typography } from "@mui/material";
import axiosConfig from "../../configs/AxiosConfig";
import LinearProgress from "@mui/material/LinearProgress";

export default function CloudService() {
    const [templates, setTemplates] = useState([]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Cloud Services", icon: "cloud_services" },
    ];

    const animationMap = {
        ocrAnimation,
    };

    useEffect(() => {
        axiosConfig
            .get("templates?is_cloud=1")
            .then((response) => {
                setTemplates(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Cloud Services
            </Typography>
            <Typography variant="body1" gutterBottom>
                Unlock the full potential of our integrated cloud services
            </Typography>
            {templates && templates.length ? (
                <Grid container spacing={3}>
                    {templates.map((template, index) => (
                        <CreationType
                            text={template.title}
                            description={template.description}
                            url={`/cloud-services/${template.slug}`}
                            key={index}
                            icon={
                                <Lottie
                                    animationData={animationMap[template.icon]}
                                    style={{ height: 200 }}
                                    loop={true}
                                />
                            }
                            sm={4}
                        />
                    ))}
                </Grid>
            ) : (
                <LinearProgress />
            )}
        </Layout>
    );
}
