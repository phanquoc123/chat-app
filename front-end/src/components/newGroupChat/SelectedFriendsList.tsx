import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";
import { X } from "lucide-react";

interface SelectedFriendsListProps {
  invitedFriends: Friend[];
  onRemove: (friend: Friend) => void;
}

export default function SelectedFriendsList({
  invitedFriends,
  onRemove,
}: SelectedFriendsListProps) {

  if (invitedFriends.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {invitedFriends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-1 bg-muted text-sm rounded-full px-3 py-1"
        >
          <UserAvatar
            type="chat"
            name={friend.displayName}
            avatarUrl={friend.avatarUrl}
          />

          <span>{friend.displayName}</span>

          <X
            className="size-3 cursor-pointer hover:text-red-500"
            onClick={() => onRemove(friend)}
          />
        </div>
      ))}
    </div>
  );
}