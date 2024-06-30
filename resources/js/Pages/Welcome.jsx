import React from "react";
import { useAuth } from "../providers/AuthProvider";
import GuestHome from "./Home/GuestHome";
import AuthHome from "./Home/AuthHome";

export default function Welcome() {
    const { user, userLoading } = useAuth();

    return <>{user ? <AuthHome /> : <GuestHome />}</>;
}
