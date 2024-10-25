import bcrypt from "bcrypt";
import getPrismaInstance from "../../config/prisma.js";

const prisma = getPrismaInstance();

export const addUser = async ({
  email,
  first_name,
  last_name,
  password,
  bio,
  avatar,
}) => {
  let hashedPassword;
  if (password) hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      first_name,
      last_name,
      bio,
      avatar,
      hashedPassword,
    },
  });

  return newUser;
};

export const getUsers = async ({ userId }) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: parseInt(userId),
      },
    },
    orderBy: {
      first_name: "asc",
    },
  });

  return users;
};

export const getUser = async ({ id }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return user;
};

export const getUserByEmail = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const updateUser = async ({ id, first_name, last_name, email, bio, avatar, }) => {
  const updatedUser = await prisma.user.update({
    data: {
      first_name,
      last_name,
      email,
      bio,
      avatar,
    },
    where: {
      id: parseInt(id),
    },
  });

  return updatedUser;
};

export const updatePasswordUser = async ({ newPassword, email }) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    data: {
      hashedPassword,
    },
    where: {
      email,
    }
  });

  return updatedUser;
};  

export const updateAvatarUser = async ({ id, avatar }) => {
  const updatedUser = await prisma.user.update({
    data: {
      avatar,
    },
    where: {
      id: parseInt(id),
    },
  });

  return updatedUser;
};

export const getMessageByUserId = async ({ id }) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      sentMessages: {
        include: {
          receiver: true,
          sender: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      receivedMessages: {
        include: {
          receiver: true,
          sender: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return user;
};
