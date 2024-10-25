class SocketServices {
    connection( socket ) {
        socket.on("disconnect", () => {
            console.log(" User is connecting ");
        });

        socket.on("send:message", (data) => {
            const userChat = onlineUsers.get(data.to);
            if(userChat) {
                socket.to(userChat).emit("update:message", {
                    from: data.from,
                    message: data.message,
                });
            }
        });

        socket.on("add:user", (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.broadcast.emit("online-users", {
                onlineUsers: Array.from(onlineUsers.keys()),
            });
        });

        socket.on("remove:user", (userId) => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("online-users", {
                onlineUsers: Array.from(onlineUsers.keys()),
            });
        });

        socket.on("outgoing:voice-call", (data) => {
            const { to, from, roomId, callType, } = data;
            const otherUser = onlineUsers.get(to);
            if(otherUser) {
                socket.to(otherUser).emit("incoming:voice-call", {
                    from,
                    roomId,
                    callType
                });
            }
        });

        socket.on("outgoing:video-call", (data) => {
            const { to, from, roomId, callType, } = data;
            const otherUser = onlineUsers.get(to);
            if(otherUser) {
                socket.to(otherUser).emit("incoming:video-call", {
                    from,
                    roomId,
                    callType
                });
            }
        });

        socket.on("reject:voice-call", (data) => {
            const { from, } = data;
            const rejectUser = onlineUsers.get(from);
            if(rejectUser) {
                socket.to(rejectUser).emit("rejected:voice-call");
            }
        });

        socket.on("reject:video-call", (data) => {
            const { from, } = data;
            const rejectUser = onlineUsers.get(from);
            if(rejectUser) {
                socket.to(rejectUser).emit("rejected:video-call");
            }
        });

        socket.on("accept:incoming-call", (data) => {
            const { id, } = data;
            const otherUser = onlineUsers.get(id);
            if(otherUser) {
                socket.to(otherUser).emit("accept:call");
            }
        });
    }
}

export default SocketServices = new SocketServices();