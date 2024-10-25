import getPrismaInstance from "../../config/prisma.js";

const prisma = getPrismaInstance();

const MESSAGES_BATCH = 10;

export const createMessage = async ({ content, from, to, status, type }) => {
  const newMessage = await prisma.message.create({
    data: {
      content: content,
      messageStatus: status,
      type,
      sender: {
        connect: {
          id: parseInt(from),
        },
      },
      receiver: {
        connect: {
          id: parseInt(to),
        },
      },
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  return newMessage;
};

export const updateMessageStatus = async ({ messageStatus }, ...data) => {
  const updatedMessage = await prisma.message.updateMany({
    where: {
      id: {
        in: data,
      },
    },
    data: {
      messageStatus,
    },
  });

  return updatedMessage;
};

export const getMessageByFromTo = async ({ from, to }) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: parseInt(from),
          receiverId: parseInt(to),
        },
        {
          senderId: parseInt(to),
          receiverId: parseInt(from),
        },
      ],
    },
    orderBy: {
      id: "asc",
    },
  });

  return messages;
};

export const getMessageByFromToQuery = async ({ from, to, cursor }) => {
  let messages = [];

  if (parseInt(cursor) !== 0 && cursor) {
    messages = await prisma.message.findMany({
      take: MESSAGES_BATCH,
      skip: 1,
      cursor: {
        id: parseInt(cursor),
      },
      where: {
        OR: [
          {
            senderId: parseInt(from),
            receiverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            receiverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    messages = await prisma.message.findMany({
      take: MESSAGES_BATCH,
      where: {
        OR: [
          {
            senderId: parseInt(from),
            receiverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            receiverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return messages;
};
