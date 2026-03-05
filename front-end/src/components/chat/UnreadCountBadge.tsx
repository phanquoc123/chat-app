export default function UnreadCountBadge({unReadCount}:{unReadCount:number}) {
  return (
    <div className="absolute -top-1 -right-1 z-10 inline-flex items-center justify-center">
      <span className="absolute inline-flex h-full w-full rounded-full bg-primary/30 animate-ping opacity-60"></span>
      <span className="relative flex items-center justify-center size-5 rounded-full bg-gray-500 text-primary-foreground text-[10px] font-bold  ring-background">
        {unReadCount > 9 ? "9+" : unReadCount}
      </span>
    </div>
  )
}