import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send, X } from "lucide-react";
import { Input } from "../ui/input";
import { EmojiPicker } from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MessageInput({selectedConversation}: {selectedConversation: Conversation}) {
  const {user} = useAuthStore();
  if(!user) return null;
  const [inputValue, setInputValue] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {sendDirectMessage , sendGroupMessage} = useChatStore();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(f => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_IMAGE_SIZE) return false;
      return true;
    });

    if (validFiles.length === 0) return;

    const dataUrls = await Promise.all(validFiles.map(readFileAsDataURL));
    setImagePreviews(prev => [...prev, ...dataUrls]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessages = async() => {
   if(!inputValue.trim() && imagePreviews.length === 0) return;
   try {
    const images = imagePreviews.length > 0 ? imagePreviews : undefined;
    if(selectedConversation.type === "direct"){
      const participants = selectedConversation.participants;
      const other = participants.filter(p => p._id !== user?._id)[0];
      if(!other) return;
     await sendDirectMessage(other._id, inputValue, images);
    } else {
      await sendGroupMessage(selectedConversation._id, inputValue, images);
    }
   } catch (error) {
     console.error("Error sending message:", error);
     throw error;
   } finally{
     setInputValue("");
     clearImages();
   }
  }

  const handleKeyPress = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      sendMessages();
    }
  }

  return (
    <div className="flex flex-col bg-background">
     {imagePreviews.length > 0 && (
       <div className="flex gap-2 px-3 pt-3 pb-1 overflow-x-auto">
         {imagePreviews.map((src, i) => (
           <div key={i} className="relative shrink-0">
             <img src={src} alt={`Preview ${i + 1}`} className="h-24 max-w-48 rounded-lg object-cover border border-border/50"/>
             <button
               onClick={() => removeImage(i)}
               className="absolute -top-2 -right-2 rounded-full bg-destructive p-0.5 text-white shadow-sm hover:bg-destructive/90 transition-colors"
             >
               <X className="size-3.5"/>
             </button>
           </div>
         ))}
       </div>
     )}

     <div className="flex items-center gap-2 p-3 min-h-14">
       <input
         type="file"
         accept="image/*"
         multiple
         ref={fileInputRef}
         onChange={handleImageSelect}
         className="hidden"
       />
       <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth" onClick={() => fileInputRef.current?.click()}>
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
          disabled={!inputValue.trim() && imagePreviews.length === 0}
          onClick={sendMessages}>
            <Send className="size-4 text-white"/>
          </Button>
     </div>
    </div>
  )
}