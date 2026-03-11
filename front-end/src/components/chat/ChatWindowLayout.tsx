import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { ChatWelcomeScreen } from "./ChatWelcomeScreen";
import { ChatWindowSkelaton } from "./ChatWindowSkelaton";
import { SidebarInset } from "../ui/sidebar";
import { ChatWindowHeader } from "./ChatWindowHeader";
import { ChatWindowBody } from "./ChatWindowBody";
import MessageInput from "./MessageInput";

export default function ChatWindowLayout() {
  const { activeConversationId, conversations, messageLoading : loading, messages, fetchMessages, markAsSeen } = useChatStore();
  const selectedConversation = conversations.find((c) => c._id === activeConversationId) ?? null

  useEffect(()=> {
    if(!selectedConversation) return;
    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error("Error when marking messages as seen:", error);
      }
    }
    markSeen();
  },[selectedConversation,markAsSeen])

  useEffect(() => {
    if (!activeConversationId) return;
    // Chỉ fetch nếu chưa có message nào cho conversation này
    if (!messages[activeConversationId]) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);



  if(!selectedConversation) {
    return <ChatWelcomeScreen/>
  }
  if(loading){
     return <ChatWindowSkelaton/>
  }
  return (
    <>
      <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
        
        <ChatWindowHeader chat={selectedConversation}/>

        <div className="flex-1 overflow-y-auto bg-primary-foreground">
          <ChatWindowBody/>
        </div>

        <MessageInput selectedConversation={selectedConversation} />

      </SidebarInset>
    </>
  );
}
