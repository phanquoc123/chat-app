import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
    loading: false,
    receivedList : [],
    sentList:[],
    searchUserByUsername: async (username: string) => {
      try {
          set({ loading: true });
          const user = await friendService.searchUserByUsername(username);
         
          return user;
      } catch (error) {
            console.error("Error searching user by username:", error);
             return null;
      }finally{
          set({ loading: false });
      }

    },
    sendFriendRequest: async (recipientId: string, message: string) => {
       
        try {
            set({ loading: true });
            const result = await friendService.sendFriendRequest(recipientId, message);
            return result;
        } catch (error) {
            console.error("Error sending friend request:", error);
            return null;
        } finally {
            set({ loading: false });
        }
    },
    getAllFriendRequests: async () => {
        try {
            set({ loading: true });
            const { sent, received } = await friendService.getAllFriendRequest();
            if(!sent || !received){
                return;
            }
            set({ sentList: sent, receivedList: received });
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }finally{
            set({ loading: false });
        }
    },
acceptFriendRequest: async (requestId: string) => {
    try {
        set({ loading: true });
        await friendService.acceptFriendRequest(requestId);
        set((state) => ({
            receivedList: state.receivedList.filter((req) => req._id !== requestId)
        }))
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }finally{
        set({ loading: false });
    }
},
declineFriendRequest: async (requestId: string) => {
    try {
        set({ loading: true });
        await friendService.declineFriendRequest(requestId);
        set((state) => ({
            receivedList: state.receivedList.filter((req) => req._id !== requestId)
        }))
    } catch (error) {
        console.error("Error declining friend request:", error);
    }finally{
        set({ loading: false });
    }
}}))