import axios from "axios";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/actions/api.route";

export async function login(email: string, password: string) {
    const { data } = await axios.post(LOGIN_ROUTE, {
        email,
        password,
    });

    return data;
};

export async function register(first_name: string, last_name: string, email: string, password: string) {
    const { data } = await axios.post(REGISTER_ROUTE, {
        first_name,
        last_name,
        email,
        password,
    });

    return data;
};