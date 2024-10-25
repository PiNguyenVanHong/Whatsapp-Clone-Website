export type UserType = {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    bio?: string;
    password?: string;
    avatar: string;
    status?: string;
};

export type MessageType = {
    id: number;
    type: "TEXT" | "IMAGE" | "AUDIO" | "DOCUMENT" | "UNKNOW";
    content: string;
    messageStatus: string;
    fileName?: string,
    fileSize?: number,
    fileType?: string,
    numPages?: number,
    senderId: number;
    sender: UserType;
    receiverId: number;
    receiver: UserType;
    createdAt: Date;
};

export type UserContacts = UserType & {
    messageId: number;
    content: string;
    type: "TEXT" | "IMAGE" | "AUDIO" | "DOCUMENT" | "UNKNOW";
    messageStatus: "delivered" | "sent" | "read";
    senderId: number;
    receiverId: number;
    createdAt: Date;
    totalUnreadMessage: number;
};