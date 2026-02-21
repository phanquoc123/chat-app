export const updateConversationAfterMessage = (conversation, message, senderId) =>{
 conversation.set({
    seenBy:[],
    lastMessageAt: message.createdAt,
    lastMessage:{
        _id: message._id,
        content:message.content,
        senderId,
        createdAt:message.createdAt
    }
 })

 conversation.participants.forEach(participant => {
    const memberId = participant.userId.toString();
    const isSender = memberId === senderId.toString();
    const prevCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);

})}