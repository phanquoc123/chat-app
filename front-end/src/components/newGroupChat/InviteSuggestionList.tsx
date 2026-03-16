import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";

interface InviteSuggestionListProps {
    filteredFriends: Friend[];
    onSelect: (friend: Friend) => void;
}

export default function InviteSuggestionList({filteredFriends, onSelect}: InviteSuggestionListProps) {
    if (!filteredFriends || filteredFriends.length === 0) return

    return (
        <div className="border rounded-lg mt-2 max-h-45 overflow-y divide-y">
            {filteredFriends.map(friend => (
                <div key={friend._id} className=" flex items-center  p-2 cursor-pointer hover:bg-muted/50 transition" onClick={() => onSelect(friend)}>
                    <UserAvatar type="chat" name={friend.displayName} avatarUrl={friend.avatarUrl} />
                    <span className="font-medium ml-2">{friend.displayName}</span>
                </div>
            ))} 
        </div>
    )

}