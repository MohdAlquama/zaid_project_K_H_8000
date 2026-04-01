import axios from "axios";
import { attachApiInterceptors } from "@/utils/toast-system";

const axiosInstance = axios.create({
    baseURL: "/",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

attachApiInterceptors(axiosInstance);

export default axiosInstance;
