import React, { useEffect, useState } from "react";
import CreationType from "../../Layout/Elements/CreationType";
import Layout from "../../Layout/Layout";
import { Grid, Typography } from "@mui/material";
import Lottie from "lottie-react";
import contactUsAnimation from "../../assets/json/contact-us-animation.json";
import newsletterAnimation from "../../assets/json/newsletter-animation.json";
import locationAnimation from "../../assets/json/location-animation.json";
import dataAnimation from "../../assets/json/data-animation.json";
import axiosConfig from "../../configs/AxiosConfig";
import LinearProgress from "@mui/material/LinearProgress";

export default function Templates() {
    const [templates, setTemplates] = useState([]);

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Templates", icon: "templates" },
    ];

    const animationMap = {
        contactUsAnimation,
        newsletterAnimation,
        locationAnimation,
        dataAnimation,
    };

    useEffect(() => {
        axiosConfig
            .get("templates?is_cloud=0")
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
                Templates
            </Typography>
            <Typography variant="body1" gutterBottom>
                Explore our pre-prepared API templates
            </Typography>
            {templates && templates.length ? (
                <Grid container spacing={3}>
                    {templates.map((template, index) => (
                        <CreationType
                            text={template.title}
                            description={template.description}
                            url={`/templates/${template.slug}`}
                            key={index}
                            icon={
                                <Lottie
                                    animationData={animationMap[template.icon]}
                                    style={{ height: 150 }}
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
