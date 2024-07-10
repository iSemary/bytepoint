import React, { createContext, useContext, useEffect, useState } from "react";
import { Token } from "../configs/Token";
import { router } from "@inertiajs/react";
import axiosConfig from "../configs/AxiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (Token.check()) {
                    if (await Token.check()) {
                        setUser(await Token.getUser());
                        axiosConfig
                            .get("auth/2fa-check")
                            .then((response) => {})
                            .catch((error) => {
                                router.visit(error.response.data.data.redirect);
                                console.error(error);
                            });
                    }
                }
            } catch (error) {
                router.visit(`/login`);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
