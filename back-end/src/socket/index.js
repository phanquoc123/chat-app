import {Server} from "socket.io";
import express from "express";
import http from "http";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocket } from "../controllers/messageController.js";
const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true,
        // methods:["GET","POST"]
    }
})
io.use(socketMiddleware);
const onlineUsers = new Map();
io.on("connection",async(socket)=>{
    const user = socket.user;
console.log(`New socket connection: ${socket.id} for user ${user?.displayName}`);

onlineUsers.set(user._id.toString(), socket.id);

io.emit("onlineUsers", Array.from(onlineUsers.keys()));

const conversationIds = await getUserConversationsForSocket(user._id);
conversationIds.forEach(conversationId => {
    socket.join(conversationId);
});

socket.on("disconnect",()=>{
    onlineUsers.delete(user._id.toString());
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log(`Socket disconnected: ${socket.id} for user ${user?.displayName}`);
})
})

export { io, httpServer ,app};
