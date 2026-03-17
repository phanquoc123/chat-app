import { Skeleton } from "../ui/skeleton";

function ChatCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="size-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}

export default function ConversationSkelaton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <ChatCardSkeleton key={i} />
      ))}
    </div>
  );
}