import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";

export default function DirectMessageCard({ conver }: { conver: Conversation }) {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages , fetchMessages } = useChatStore();
  if (!user) return null;

  const otherUser = conver.participants.find(p => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = conver.unreadCounts[user._id];
  const lastMessage = conver.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
     await fetchMessages()
    }
  };
  return (
   
      <ChatCard
        conversationId={conver._id}
        name={otherUser.displayName ?? ""}
        timestamp={conver.lastMessage?.createdAt ? new Date(conver.lastMessage?.createdAt) : undefined}
        isActive={activeConversationId === conver._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={
        <>
        <UserAvatar type="sidebar" name={otherUser.displayName ?? ""} avatarUrl={otherUser.avatarUrl ?? undefined}/>
        <StatusBadge status="online"/>
        {unreadCount > 0 ? <UnreadCountBadge unReadCount={unreadCount}/> : ""}
        </>}
        subtitle={
          <p
            className={cn(
              "truncate text-sm",
              unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            {lastMessage}
          </p>
        }
      />
  
  );
}
