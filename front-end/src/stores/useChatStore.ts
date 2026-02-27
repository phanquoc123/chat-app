import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      conversationLoading: false,
      messageLoading: false,

      setActiveConversation: (id: string | null) => set({ activeConversationId: id }),

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          conversationLoading: false,
          messageLoading: false,
        });
      },

      fetchConversation: async () => {
        try {
          set({ conversationLoading: true });
          const { conversations } = await chatService.fetchConversation();
          set({ conversations, conversationLoading: false });
        } catch (error) {
          console.error("Error when fetching conversations", error);
          set({ conversationLoading: false });
        }
      },

      fetchMessages: async conversationId => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const converId = conversationId ?? activeConversationId;

        if (!converId) return;

        const current = messages?.[converId];
        const nextCursor = current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });
        try {
          const { messages: data, cursor } = await chatService.fetchMessage(converId, nextCursor);
          const processd = data.map(d => ({
            ...d,
            isOwn: d.senderId === user?._id,
          }));

          set((state) => {
            const prevMessages = state.messages[converId]?.items ?? [];
            const allMessages = [...processd, ...prevMessages];
            // Deduplicate theo _id, giữ thứ tự: cũ nhất → mới nhất
            const seen = new Set<string>();
            const merged = allMessages.filter((m) => {
              if (seen.has(m._id)) return false;
              seen.add(m._id);
              return true;
            });

            return {
              messages: {
                ...state.messages,
                [converId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          })
        } catch (error) {
          console.log('Error when fetch messages:', error);
        }finally{
          set({messageLoading: false})
        }
      },

      sendDirectMessage: async (recipientId, content, imageUrl) => {
        try {
          const { activeConversationId } = get();
          const { user } = useAuthStore.getState();
          const sentMessage = await chatService.sendDirectMessage(recipientId, content, imageUrl, activeConversationId || undefined);
          const conversationId = activeConversationId!;
          const messageWithOwn = { ...sentMessage, isOwn: sentMessage.senderId === user?._id };

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === conversationId ? { ...c, seenBy: [] } : c
            ),
            messages: {
              ...state.messages,
              [conversationId]: {
                items: [...(state.messages[conversationId]?.items ?? []), messageWithOwn],
                hasMore: state.messages[conversationId]?.hasMore ?? false,
                nextCursor: state.messages[conversationId]?.nextCursor ?? null,
              },
            },
          }));
        } catch (error) {
          console.error("Error when sending direct message:", error);
        }
      },
      sendGroupMessage: async (conversationId, content, imageUrl) => {
        try {
          const { user } = useAuthStore.getState();
          const sentMessage = await chatService.sendGroupMessage(conversationId, content, imageUrl);
          const messageWithOwn = { ...sentMessage, isOwn: sentMessage.senderId === user?._id };

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === conversationId ? { ...c, seenBy: [] } : c
            ),
            messages: {
              ...state.messages,
              [conversationId]: {
                items: [...(state.messages[conversationId]?.items ?? []), messageWithOwn],
                hasMore: state.messages[conversationId]?.hasMore ?? false,
                nextCursor: state.messages[conversationId]?.nextCursor ?? null,
              },
            },
          }));
        } catch (error) {
          console.error("Error when sending group message:", error);
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: state => ({
        conversations: state.conversations,
      }),
    },
  ),
);
