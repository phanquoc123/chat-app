import { Badge } from "../ui/badge";

export default function UnreadCountBadge({unReadCount}:{unReadCount:number}) {
  return (
    <div>
      <Badge variant="outline" className="bg-primary/10 text-primary size-6 flex items-center justify-center">
        {unReadCount > 9 ? "+9" : unReadCount}
      </Badge>
    </div>
  )
} 