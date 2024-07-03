import React from "react";
import { useAuth } from "../providers/AuthProvider";
import GuestHome from "./Home/GuestHome";
import AuthHome from "./Home/AuthHome";
import Layout from "../Layout/Layout";
import { LinearProgress } from "@mui/material";

export default function Welcome() {
    const { user, loading } = useAuth();

    return (
        <Layout>
            {loading ? <LinearProgress /> : user ? <AuthHome /> : <GuestHome />}
        </Layout>
    );
}
