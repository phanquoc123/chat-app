import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { EmojiPicker } from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";



export default function MessageInput({selectedConversation}: {selectedConversation: Conversation}) {
  const {user} = useAuthStore();
  if(!user) return null;
  const [inputValue, setInputValue] = useState("");
  const {sendDirectMessage , sendGroupMessage} = useChatStore();
  const sendMessages = async() => {
   if(!inputValue.trim()) return;
   try {
    if(selectedConversation.type === "direct"){
      const participants = selectedConversation.participants;
      const other = participants.filter(p => p._id !== user?._id)[0];
      if(!other) return;
     await sendDirectMessage(other._id, inputValue);
    } else {
      await sendGroupMessage(selectedConversation._id, inputValue);
    }
   } catch (error) {
     console.error("Error sending message:", error);
     throw error;
   } finally{
     setInputValue("");
   }
  }

  const handleKeyPress = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      sendMessages();
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 min-h-14 bg-background">
     <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth">
      <ImagePlus className="size-4"/>
     </Button>

     <div className="flex-1 relative">
        <Input
        onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 resize-none"
        />

        <div className="absolute right-2 -top-1/5 translate-y-2 flex items-center gap-1">
        <Button asChild variant="ghost" size="icon" className="size-8 hover:bg-primary/10 transition-smooth">
         <div><EmojiPicker onChange={(emoji) => setInputValue(prev => prev + emoji)}/></div>
        </Button>
        </div>

        
     </div>
     <Button className="bg-primary hover:bg-primary/90 transition-smooth disabled" 
        disabled={!inputValue.trim()}
        onClick={sendMessages}>
          <Send className="size-4 text-white"/>
        </Button>
    </div>
  )
}