import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import DirectMessageCard from "./DirectMessageCard";
import type { Conversation } from "@/types/chat";

function deduplicateDirectConversations(
  conversations: Conversation[],
  currentUserId: string
): Conversation[] {
  const direct = conversations.filter((c) => c.type === "direct");
  const byOtherUserId = new Map<string, Conversation>();

  for (const conv of direct) {
    const other = conv.participants.find((p) => p._id !== currentUserId);
    if (!other) continue;
    const existing = byOtherUserId.get(other._id);
    const existingTime = existing?.lastMessageAt ? new Date(existing.lastMessageAt).getTime() : 0;
    const thisTime = conv.lastMessageAt ? new Date(conv.lastMessageAt).getTime() : 0;
    if (!existing || thisTime >= existingTime) {
      byOtherUserId.set(other._id, conv);
    }
  }

  return Array.from(byOtherUserId.values()).sort((a, b) => {
    const tA = new Date(a.lastMessageAt ?? a.updatedAt).getTime();
    const tB = new Date(b.lastMessageAt ?? b.updatedAt).getTime();
    return tB - tA;
  });
}

export default function DirectChatList() {
  const { conversations } = useChatStore();
  const { user } = useAuthStore();

  if (!conversations?.length || !user) return null;

  const directConversations = deduplicateDirectConversations(conversations, user._id);

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {directConversations.map((conver) => (
        <DirectMessageCard key={conver._id} conver={conver} />
      ))}
    </div>
  );
}