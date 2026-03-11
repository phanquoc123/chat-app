import { useChatStore } from "@/stores/useChatStore"
import { ChatWelcomeScreen } from "./ChatWelcomeScreen";
import { MessageItemModal } from "./MessageItemModal";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export const ChatWindowBody = () => {
    const {activeConversationId, conversations, messages:allMessages,fetchMessages} = useChatStore();
    const [lastMessageStatus, setLastMessageStatus] = useState<"seen" | "deliverd">("deliverd");
    const messages = allMessages[activeConversationId!]?.items ?? []
    const selectedConversation = conversations.find((conver) => conver._id === activeConversationId)
    const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
     const reversedMessages = [...messages].reverse();
      const key = `chat-scroll-${activeConversationId}`;

    useEffect(() => {
      const lastMessage = selectedConversation?.lastMessage;
      if (!lastMessage) return;

      const seenBy = selectedConversation?.seenBy || [];
      setLastMessageStatus(seenBy.length > 0 ? "seen" : "deliverd");
    }, [selectedConversation]);

     useLayoutEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversationId]);

    const fetchMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    }
    

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Lỗi xảy ra khi fetch thêm tin", error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) {
      return;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      })
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length]);

  

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

        <div id="scrollableDiv" ref={containerRef}  onScroll={handleScrollSave} className="flex flex-col-reverse overflow-y-auto overflow-x-hidden"
        >
           <div ref={messagesEndRef}></div>
          <InfiniteScroll
            dataLength={messages.length}
            next={() => fetchMoreMessages}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
            loader={<p>Loading...</p>}
            inverse={true}
            style={{ display: 'flex', flexDirection: 'column-reverse',overflow: 'visible' }}
            
          >
          {reversedMessages.map((message,index) => (
      <MessageItemModal 
        key={message._id ?? index}
        message={message}
        index={index}
        messages={reversedMessages}
        selectedConversation={selectedConversation}
        lastMessageStatus={lastMessageStatus}
      />
           ))}
          </InfiniteScroll>
          

          
        </div>
    </div>
  );
};