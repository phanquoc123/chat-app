import type { SocketState } from "@/types/store";

import { create } from "zustand/react";
import { useAuthStore } from "./useAuthStore";

import { io, Socket } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL

export const useSocketStore = create<SocketState>((set,get) => ({
  socket: null,
  onlineUsers: [],
  connect: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const  existingSocket = useSocketStore.getState().socket;

    if (existingSocket) return ;
    const socket : Socket = io(baseURL,{
        auth:{token:accessToken},
        transports: ['websocket']
    })

    set({ socket });

    socket.on("connect", ()=> {
        console.log("Connected to socket server with id:", socket.id);
    })
    socket.on("onlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    })

    socket.on("new-message", ({ message, conversation,unreadCounts  }) => {
      const { addMessage, updateConversation, activeConversationId, markAsSeen } = useChatStore.getState();

      addMessage(message);

      const lastMessage = {
        _id: message._id,
        content: message.content,
        createdAt: message.createdAt,
        sender: {
          _id: message.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

       const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if(activeConversationId === message.conversationId) {
        markAsSeen();
      }
      updateConversation(updatedConversation);
    })

     // read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const {updateConversation } = useChatStore.getState();
      const updatedConversation = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      updateConversation(updatedConversation);
    });
  },
  disconnect: () => {
    const existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.disconnect();
    set({ socket: null });
    }
  },
}));