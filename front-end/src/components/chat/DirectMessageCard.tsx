import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";

export default function DirectMessageCard({ conver }: { conver: Conversation }) {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages , fetchMessages } = useChatStore();
  const {onlineUsers} = useSocketStore();
  if (!user) return null;

  const otherUser = conver.participants.find(p => p._id !== user._id);
  if (!otherUser) return null;

  const unreadCount = conver.unreadCounts?.[user._id] ?? 0;
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
        <StatusBadge status={onlineUsers.includes(otherUser?._id.toString() ?? "") ? "online" : "offline"} />
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
