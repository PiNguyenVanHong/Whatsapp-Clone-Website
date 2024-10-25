import { renameSync } from "fs";
import bcrypt from "bcrypt";
import {
  getUserByEmail,
  getUsers,
  updateUser,
  getUser,
  updateAvatarUser,
  updatePasswordUser,
} from "../services/user.service.js";

export const getAllUsersAndGroupByLetter = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!!!" });
    }

    const users = await getUsers({ userId });

    if (users.length <= 0) {
      return res.status(200).json({ message: "List user is emptying" });
    }
    const usersGroupByLetter = {};
    users.forEach((user) => {
      const letter = user.first_name.charAt(0).toUpperCase();
      if (!usersGroupByLetter[letter]) {
        usersGroupByLetter[letter] = [];
      }
      usersGroupByLetter[letter].push(user);
    });

    return res.status(200).json({
      users: usersGroupByLetter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { email, first_name, last_name, bio, avatar } = req.body;

    if (!email) {
      return res.status(403).json({ message: "Email is required!" });
    }
    if (!first_name || !last_name) {
      return res
        .status(403)
        .json({ message: "First name and Last name are required!" });
    }
    if (!avatar) {
      return res.status(403).json({ message: "Image is required!" });
    }

    const user = await getUserByEmail({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    const updatedUser = await updateUser({
      id: user.id,
      email,
      first_name,
      last_name,
      bio,
      avatar,
    });

    return res.status(200).json({ updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const updatePasswordUserById = async (req, res, next) => {
  try {
    const { email, password, newPassword } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required!" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required!" });
    }

    const user = await getUserByEmail({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old Password is not correct!!!" });
    }

    const updatedUser = await updatePasswordUser({ email: user.email, newPassword });

    return res.status(200).json({ message: "Updated Successfully!!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const updateAvatarUserById = async (req, res, next) => {
  try {
    const { file } = req;
    const { id } = req.query;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await getUser({ id });

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    const date = Date.now();
    let fileName = "uploads/avatars/" + date + file.originalname;
    renameSync(file.path, fileName);

    await updateAvatarUser({ avatar: fileName, id: user.id });

    return res.status(200).json({ fileName });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};
