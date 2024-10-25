import { renameSync } from "fs";
import {
  createMessage,
  getMessageByFromTo,
  getMessageByFromToQuery,
  updateMessageStatus,
} from "../services/message.service.js";
import { getMessageByUserId as getMessageByUserIdService } from "../services/user.service.js";
import { getInfoFile, getInfoFileByURL } from "../helpers/pdf-parse.helper.js";

const MESSAGES_BATCH = 10;

export const addMessage = async (req, res, next) => {
  try {
    const { message, from, to } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!to) {
      return res.status(400).json({ message: "Receiver is required" });
    }
    const user = onlineUsers.get(to);
    const newMessage = await createMessage({
      content: message,
      from,
      to,
      status: user ? "delivered" : "sent",
    });

    return res.status(200).json({ message: newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const date = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let fileName = "uploads/images/" + date + file.originalname;
    renameSync(file.path, fileName);

    const { from, to } = req.query;

    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!to) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    const user = onlineUsers.get(to);
    const newMessage = await createMessage({
      content: fileName,
      from,
      to,
      status: user ? "delivered" : "sent",
      type: "IMAGE",
    });

    return res.status(200).json({ message: newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "Audio is required" });
    }

    const date = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let audioName = "uploads/recordings/" + date + file.originalname;
    renameSync(file.path, audioName);

    const { from, to } = req.query;

    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!to) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    const user = onlineUsers.get(to);
    const newMessage = await createMessage({
      content: audioName,
      from,
      to,
      status: user ? "delivered" : "sent",
      type: "AUDIO",
    });

    return res.status(200).json({ message: newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const uploadFileMessage = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const { from, to } = req.query;

    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!to) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    const { path, mimetype } = file; 

    let type = ""; let infoParse = {};
    if (mimetype.startsWith("image/")) {
      type = "IMAGE";
    } else if (mimetype.startsWith("audio/")) {
      type = "AUDIO";
    } else if (mimetype === "application/pdf" || mimetype === "application/msword") {
      type = "DOCUMENT";
      infoParse = await getInfoFile(file, res);
    } else {
      type = "UNKNOW";
    }

    const user = onlineUsers.get(to);
    const newMessage = await createMessage({
      content: path,  
      from,
      to,
      status: user ? "delivered" : "sent",
      type,
    });

    return res.status(200).json({ message: {...newMessage, ...infoParse} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const getMessageBySenderIdAndReceiverId = async (req, res, next) => {
  try {
    const { from, to } = req.params;

    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!to) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    const messages = await getMessageByFromTo({ from, to });

    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await updateMessageStatus({ messageStatus: "read" }, ...unreadMessages);

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const getMessageBySenderIdAndReceiverIdQuery = async (
  req,
  res,
  next
) => {
  try {
    const { from, to } = req.params;
    const { cursor } = req.query;

    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }
    if (!to) {
      return res.status(400).json({ message: "Receiver is required" });
    }
    if (!cursor) {
      return res.status(400).json({ message: "Cursor is required" });
    }

    const messages = await getMessageByFromToQuery({ from, to, cursor });
    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    const unreadMessages = [];

    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
      if(message.type === "DOCUMENT") {
        const infoParse = await getInfoFileByURL(message.content);
        messages[index] = {...message, ...infoParse};   
      }
    }
    
    await updateMessageStatus({ messageStatus: "read" }, ...unreadMessages);

    return res.status(200).json({ items: messages, nextCursor });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const getContactswithMessageByUserId = async (req, res, next) => {
  try {
    const { from } = req.params;

    if (!from) {
      return res.status(400).json({ message: "Sender is required" });
    }

    const userId = parseInt(from);
    const user = await getMessageByUserIdService({ id: userId });

    const messages = [...user.sentMessages, ...user.receivedMessages];

    messages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((message) => {
      const isSender = message.senderId === userId;
      const otherUserId = isSender ? message.receiverId : message.senderId;

      if (message.messageStatus === "sent") {
        messageStatusChange.push(message.id);
      }

      const {
        id,
        type,
        content,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = message;

      if (!users.get(otherUserId)) {
        let user = {
          messageId: id,
          type,
          content,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };

        if (isSender) {
          user = {
            ...user,
            ...message.receiver,
            totalUnreadMessage: 0,
          };
        } else {
          user = {
            ...user,
            ...message.sender,
            totalUnreadMessage: messageStatus !== "read" ? 1 : 0,
          };
        }

        users.set(otherUserId, { ...user });
      } else if (messageStatus !== "read" && !isSender) {
        const user = users.get(otherUserId);
        users.set(otherUserId, {
          ...user,
          totalUnreadMessage: user.totalUnreadMessage + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await updateMessageStatus(
        { messageStatus: "delivered" },
        ...messageStatusChange
      );
    }

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};
