import React from "react";
import CreationType from "../../Layout/Elements/CreationType";
import Layout from "../../Layout/Layout";
import { Grid, Typography } from "@mui/material";
import Lottie from "lottie-react";
import contactUsAnimation from "../../assets/json/contact-us-animation.json";
import newsletterAnimation from "../../assets/json/newsletter-animation.json";
import locationAnimation from "../../assets/json/location-animation.json";
import dataAnimation from "../../assets/json/data-animation.json";

export default function Templates() {
    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Templates", icon: "templates" },
    ];

    return (
        <Layout links={links}>
            <Typography variant="h3" gutterBottom>
                Templates
            </Typography>
            <Typography variant="body1" gutterBottom>
                Explore our API templates
            </Typography>
            <Grid container spacing={3}>
                <CreationType
                    text="Fetch Paginated Data"
                    description="Fetch and manage paginated data with ease"
                    url="/templates/fetch-data"
                    icon={
                        <Lottie
                            animationData={dataAnimation}
                            style={{ height: 150 }}
                            loop={true}
                        />
                    }
                    sm={4}
                />
                <CreationType
                    text="Contact Us"
                    description="Set up a contact form quickly and efficiently"
                    url="/templates/contact-us"
                    icon={
                        <Lottie
                            animationData={contactUsAnimation}
                            style={{ height: 150 }}
                            loop={true}
                        />
                    }
                    sm={4}
                />
                <CreationType
                    text="News Letter"
                    description="Easily create and manage newsletters"
                    url="/templates/newsletter"
                    icon={
                        <Lottie
                            animationData={newsletterAnimation}
                            style={{ height: 150 }}
                            loop={true}
                        />
                    }
                    sm={4}
                />
                <CreationType
                    text="IP to Location"
                    description="Determine the geographical location of an IP address"
                    url="/templates/ip-to-location"
                    icon={
                        <Lottie
                            animationData={locationAnimation}
                            style={{ height: 150 }}
                            loop={true}
                        />
                    }
                    sm={4}
                />
            </Grid>
        </Layout>
    );
}
