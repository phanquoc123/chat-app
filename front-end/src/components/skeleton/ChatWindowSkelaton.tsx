import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { SidebarInset } from "../ui/sidebar";

function MessageSkeleton({ isOwn }: { isOwn: boolean }) {
  return (
    <div className={cn("flex gap-2 mt-3", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && <Skeleton className="size-8 rounded-full shrink-0" />}
      <div className={cn("flex flex-col gap-1.5", isOwn ? "items-end" : "items-start")}>
        <Skeleton className={cn("h-10 rounded-xl", isOwn ? "w-44" : "w-52")} />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export const ChatWindowSkelaton = () => {
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-4 py-3 space-y-1">
        <MessageSkeleton isOwn={false} />
        <MessageSkeleton isOwn={false} />
        <MessageSkeleton isOwn={true} />
        <MessageSkeleton isOwn={false} />
        <MessageSkeleton isOwn={true} />
        <MessageSkeleton isOwn={true} />
        <MessageSkeleton isOwn={false} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="flex-1 h-9 rounded-md" />
        <Skeleton className="h-9 w-14 rounded-md" />
      </div>
    </SidebarInset>
  );
}