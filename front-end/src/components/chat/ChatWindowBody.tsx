import { useChatStore } from "@/stores/useChatStore"
import { ChatWelcomeScreen } from "./ChatWelcomeScreen";
import { MessageItemModal } from "./MessageItemModal";

export const ChatWindowBody = () => {
    const {activeConversationId, conversations, messages:allMessages} = useChatStore();
    const messages = allMessages[activeConversationId!]?.items ?? []
    const selectedConversation = conversations.find((conver) => conver._id === activeConversationId)
    if(!selectedConversation){
        return <ChatWelcomeScreen/>
    }

    if(!messages?.length) {
     return (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl bg-primary-foreground p-8 text-center">Not have messages</div>
     )
    }
  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">

        <div className="flex flex-col overflow-y-auto overflow-x-hidden">
           {messages.map((message,index) => (
      <MessageItemModal 
        key={message._id}
        message={message}
        index={index}
        messages={messages}
        selectedConversation={selectedConversation}
        lastMessageStatus="deliverd"
      />
           ))}
        </div>
    </div>
  );
};