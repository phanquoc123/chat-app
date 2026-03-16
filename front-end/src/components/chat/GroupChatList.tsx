import { useChatStore } from "@/stores/useChatStore"
import GroupChatCard from "./GroupChatCard";

export default function GroupChatList() {
  const {conversations} = useChatStore()
   if(!conversations){
    return null;
  }
  const groupChatList = conversations.filter((conver) => conver.type === "group")
  if(groupChatList.length === 0) return <div className="flex justify-center items-center font-bold text-lg"> No groups chat yet </div>
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
         {groupChatList.map((conver) => {
           return <GroupChatCard key={conver._id} conver={conver}/>
         })}
       </div>
  )
}