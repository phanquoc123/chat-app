import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

export default function SentRequests() {
    const{ sentList } = useFriendStore();

    if(!sentList || sentList.length === 0){
        return <p className="text-center text-sm text-muted-foreground">No sent friend requests</p>
    }
    return (
       
        <div className="space-y-3 mt-4">
         <>{sentList.map((request) => (
            <FriendRequestItem key={request._id} requestInfo={request} actions={<p className="text-muted-foreground text-sm">Waiting for response....</p>} type="sent" />
         ))}</>
        </div>
       
    )
}