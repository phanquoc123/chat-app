import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"



interface IUserAvatarProps{
    type:"sidebar"|"chat"|"profile",
    name:string,
    avatarUrl?:string,
    className?:string,
}
export default function UserAvatar({type,
name,
avatarUrl,
className}: IUserAvatarProps) {
    const bgAvatar = !avatarUrl?.trim() ? "bg-blue-500" : "";
    if(!name){
        name = "Chat App"
    }
  const hasValidAvatar = Boolean(avatarUrl?.trim());

  return (
    <Avatar
      className={cn(
        "flex items-center justify-center",
        !hasValidAvatar && "bg-blue-500 text-white",
        type === "sidebar" && "size-12 text-base",
        type === "chat" && "size-8 text-sm",
        type === "profile" && "size-24 text-3xl shadow-md",
        className
      )}
    >
      {hasValidAvatar && <AvatarImage src={avatarUrl!} alt={name} />}
      <AvatarFallback
        delayMs={hasValidAvatar ? undefined : 0}
        className={`${bgAvatar} text-white font-semibold`}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}   