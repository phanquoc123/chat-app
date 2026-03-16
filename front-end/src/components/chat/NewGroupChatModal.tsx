import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus, Users } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import type { Friend } from "@/types/user";
import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import SelectedFriendsList from "../newGroupChat/SelectedFriendsList";
import { toast } from "sonner";
import { useChatStore } from "@/stores/useChatStore";



export default function NewGroupChatModal() {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);

  const { friends , getFriends } = useFriendStore();
  const {loading, createConversation} = useChatStore();

  const handleGetFriends = async () => {
    await getFriends();
  }
  const handleSelectFriend = (friend: Friend) => {
    setInvitedFriends([...invitedFriends, friend]);
    setSearch("");
  }
  const handleRemoveFriend = (friend : Friend) => {
   setInvitedFriends(invitedFriends.filter((f) => f._id !== friend._id))
  }
  const handleSubmit  = async(e : React.FormEvent) => {
    try {
       e.preventDefault();
       if(invitedFriends.length === 0) {
        toast.warning("Please have at lease 1 person in group")
       }

       await createConversation(
        "group",
        groupName,
        invitedFriends.map(u => u._id)
       );
       setSearch("");
       setInvitedFriends([]);
    } catch (error) {
      console.log("Error when create new group chat:", error)
    }
   


  }
  const filteredFriends = friends?.filter(friend => friend.displayName.toLowerCase().includes(search.toLowerCase()) && !invitedFriends.some((f) => f._id === friend._id));
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={handleGetFriends} className="flex z-10 justify-center items-center size-5 rounded-full transition cursor-pointer">
          <Users className="size-4" />
          <span className="sr-only">New Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 border-none">
      <DialogHeader>
        <DialogTitle className="capitalize">
          Create New Group
        </DialogTitle>
        <form action="" className="space-y-4" onSubmit={handleSubmit}>
         <div className="space-y-2">
          <Label htmlFor="groupName" className="text-sm font-semibold" >Group Name</Label>
          <Input
            id="groupName"
            placeholder="Enter group name..."
            value={groupName}
            required
            onChange={(e) => setGroupName(e.target.value)}
            className="border-border/50 focus:border-primary/50 "
          />
         </div>
         <div className="space-y-2">
          <Label htmlFor="invite" className="text-sm font-semibold" >Search Friends</Label>
          <Input
            id="invite"
            placeholder="Enter your friend name...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border/50 focus:border-primary/50 "
          />
           
               {search && filteredFriends.length > 0 && (
                <InviteSuggestionList filteredFriends={filteredFriends} onSelect={handleSelectFriend}/>
               ) }

               <SelectedFriendsList invitedFriends={invitedFriends} onRemove={handleRemoveFriend}/>
        

         </div>
         <DialogFooter>
          <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white hover:opacity-90 transition"
          >
          {
            loading ? (
              <span>Loading...</span>
            ) : (
              <>
              <UserPlus className="size-4 mr-2"/>

              Create chat group
              </>
            )
          }
          </Button>
         </DialogFooter>
        </form>
      </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}