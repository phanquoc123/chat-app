import { useChatStore } from "@/stores/useChatStore";
import type { Conversation, Participant } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";

export const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  let otherUser: Participant | null = null;
  chat = chat ?? conversations.find(c => c._id === activeConversationId);
  if (!chat) {
    return (
      <header className="sticky top-0 z-10 flex w-full items-center gap-2 px-4 py-2 md:hidden">
        <SidebarTrigger className="text-foreground -ml-1" />
      </header>
    );
  }

  if (chat.type === "direct") {
    const otherUsers = chat.participants.filter(p => p._id != user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
    if (!user || !otherUser) return;
  }
  return (
    <header className="bg-background sticky top-0 z-10 flex items-center px-4 py-2">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger className="=ml-1 text-foreground" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <div className="p-2 w-full flex items-center gap-3">
            <div className="relative">
            {chat.type === "direct" ? (
                <>
             <UserAvatar type="sidebar" name={otherUser?.displayName || "Chat App"} avatarUrl={otherUser?.avatarUrl || undefined} />
             <StatusBadge status="online"/>
                </>
            ) : (
                <>
                <GroupChatAvatar type="sidebar" participants={chat.participants}/>
                </>
            )
            }
            </div>

            <h2 className="font-semibold text-foreground">
                {chat.type === "direct" ? otherUser?.displayName : chat.group.name}
            </h2>
        </div>
      </div>
    </header>
  );
};
