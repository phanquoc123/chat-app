import { MessageCircleDashed } from "lucide-react"
import { SidebarInset } from "../ui/sidebar"
import { ChatWindowHeader } from "./ChatWindowHeader"

export const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full bg-transparent">
      <ChatWindowHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl bg-primary-foreground p-8 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
          <MessageCircleDashed className="size-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Chào mừng bạn đến với ChatApp!
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Vui lòng chọn một cuộc hội thoại ở thanh bên để bắt đầu nhắn tin.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}