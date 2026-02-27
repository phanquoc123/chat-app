import type { Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";

interface GroupChatAvatarProps {
  participants: Participant[];
  type: "chat" | "sidebar";
}

export default function GroupChatAvatar({ participants, type }: GroupChatAvatarProps) {
  const avatars = [];
  const limit = Math.min(participants.length, 4);
  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatars.push(
      <UserAvatar
        key={i}
        type={type}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
      />,
    );
  }
  return (
    <div className="*:data-[slot=avatar]:ring-background relative flex -space-x-2 *:data-[slot=avatar]:ring-2">
      {avatars}
      {participants.length > limit && (
        <div className="bg-muted ring-background text-muted-foreground z-10 flex size-8 items-center justify-center rounded-full ring-2">
          <Ellipsis className="size-4" />
        </div>
      )}
    </div>
  );
}
