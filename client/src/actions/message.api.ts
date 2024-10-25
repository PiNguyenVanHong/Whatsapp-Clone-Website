import axios from "axios";
import { ADD_AUDIO_MESSAGE_ROUTE, ADD_FILE_ROUTE, ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE, GET_INITIAL_CONTACTS_ROUTE, GET_MESSAGES_QUERY_ROUTE, GET_MESSAGES_ROUTE } from "@/actions/api.route";

type MessageSend = {
    message?: string | FormData;
    from?: number;
    to?: number;
    cursor?: any;
}

export const addMessage = async ({ message, from, to }: MessageSend) => {
    const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        message,
        from,
        to,
    });

    return data;
}

export const addImageMessage = async ({ message, from, to }: MessageSend) => {
    const { data } = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, message, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        params: {
            from,
            to,
        },
    });

    return data;
}

export const addFileMessage = async ({ message, from, to }: MessageSend) => {
    const { data } = await axios.post(ADD_FILE_ROUTE, message, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        params: {
            from,
            to,
        },
    });

    return data;
}

export const addAudioMessage = async ({ message, from, to }: MessageSend) => {
    const { data } = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, message, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        params: {
            from,
            to,
        },
    });

    return data;
}

export const getMessages = async ({ from, to }: MessageSend) => {
    const { data } = await axios.get(`${GET_MESSAGES_ROUTE}/${from}/${to}`);

    return data;
}

export const getMessagesQuery = async ({ from, to, cursor }: MessageSend) => {
    const { data } = await axios.get(`${GET_MESSAGES_QUERY_ROUTE}/${from}/${to}`, {
        params: {
            cursor,
        },
    });

    return data;
}

export const getContactMessage = async ({ from }: MessageSend) => {
    const { data } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${from}`);

    return data;
}