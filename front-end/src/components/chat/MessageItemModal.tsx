import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message } from "@/types/chat"
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemModalProps{
    message: Message;
    index: number;
     messages: Message[];
     selectedConversation: Conversation;
     lastMessageStatus: "deliverd" | "seen"
}

export const MessageItemModal = ({message,index,messages,selectedConversation,lastMessageStatus} : MessageItemModalProps) => {

  const prevMessage = messages[index - 1];
  const isBreakGroup = index === 0 || prevMessage.senderId !== message.senderId || new Date(message.createdAt).getTime() - new Date(prevMessage?.createdAt || 0).getTime() > 5 * 60 * 1000;

  const participant = selectedConversation.participants.find(p => p._id.toString() === message.senderId.toString());
  return (
    <div className={cn("flex gap-2 mt-1 ", message.isOwn ? "justify-end" : "justify-start")}>
      {!message.isOwn &&(
        <div className="w-8">
          {isBreakGroup && (
            <UserAvatar type="chat" name={participant?.displayName ?? ""} avatarUrl={participant?.avatarUrl ?? undefined}/>
          )}
        </div>
      )}

      <div className={cn("max-w-xs lg:max-w-md space-y-1 flex flex-col", message.isOwn ? "items-end" : "items-start")}>
        <Card className={cn("p-3", message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100")}>
          <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
        </Card>

        {isBreakGroup && (
          <span className="text-xs text-muted-foreground px-1">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        )}

        {message.isOwn && message._id === selectedConversation.lastMessage?._id && (
             <Badge variant="outline" className={cn("text-xs", lastMessageStatus === "seen" ? "text-green-500" : "text-gray-500")}>
                {lastMessageStatus}
             </Badge>
        )}
      </div>
    </div>
  )
} 