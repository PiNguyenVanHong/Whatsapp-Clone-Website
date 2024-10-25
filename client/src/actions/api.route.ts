export const HOST = import.meta.env.VITE_PUBLIC_BACKEND_URL;

const AUTH_ROUTES = `${HOST}/api/auth`;
const MESSAGE_ROUTES = `${HOST}/api/messages`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTES}/check-user`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTES}/onboard-user`;
export const UPDATE__AVATAR_USER_ROUTE = `${AUTH_ROUTES}/update-image-user`;
export const UPDATE_USER_ROUTE = `${AUTH_ROUTES}/update-user`;
export const UPDATE_PASSWORD_USER_ROUTE = `${AUTH_ROUTES}/update-password-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTES}/get-contacts`;
export const GET_CALL_TOKEN = `${AUTH_ROUTES}/generate-token`;

export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-message`;
export const ADD_FILE_ROUTE = `${MESSAGE_ROUTES}/uploads`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-audio-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages`;
export const GET_MESSAGES_QUERY_ROUTE = `${MESSAGE_ROUTES}/get-messages-query`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGE_ROUTES}/get-initial-contacts`;