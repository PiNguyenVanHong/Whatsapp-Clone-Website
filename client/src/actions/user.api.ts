import axios from "axios";
import { UserType } from "@/utils/types";
import {
  CHECK_USER_ROUTE,
  GET_ALL_CONTACTS,
  GET_CALL_TOKEN,
  ONBOARD_USER_ROUTE,
  UPDATE__AVATAR_USER_ROUTE,
  UPDATE_PASSWORD_USER_ROUTE,
  UPDATE_USER_ROUTE,
} from "@/actions/api.route";

export async function createUser({ email, first_name, last_name, password, bio, avatar }: UserType) {
  const { data } = await axios.post(ONBOARD_USER_ROUTE, {
    email,
    first_name, 
    last_name,
    password,
    bio,
    avatar,
  });
  return data;
}

export async function updateAvatarUser({
  file,
  id,
}: {
  file: FormData;
  id: number;
}) {
  const { data } = await axios.post(UPDATE__AVATAR_USER_ROUTE, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      id,
    },
  });

  return data;
}

export async function updateUser({ id, email, last_name, first_name, password, bio, avatar }: UserType) {
  const { data } = await axios.put(UPDATE_USER_ROUTE, {
    id,
    email,
    last_name, 
    first_name,
    password,
    bio,
    avatar,
  });

  return data;
}

export async function updatePasswordUser(email: string, password: string, newPassword: string) {
  const { data } = await axios.put(UPDATE_PASSWORD_USER_ROUTE, {
    email, password, newPassword,
  });

  return data;
}

export async function getUserByLetter( userId: number ) {
  const { data } = await axios.get(GET_ALL_CONTACTS, {
    params: {
      userId,
    },
  });

  return data;
}

export async function generateToken(id: number) {
  const { data } = await axios.get(`${GET_CALL_TOKEN}/${id}`);

  return data;
}

export async function checkUser(email: string) {
  const { data } = await axios.post(CHECK_USER_ROUTE, { email });

  return data;
}
