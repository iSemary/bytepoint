import axios from "axios";
import { Token } from "./Token";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX,
    headers: {
        Authorization: "Bearer " + Token.get(),
        "Content-Type": "application/json",
    },
});

export default axiosConfig;
