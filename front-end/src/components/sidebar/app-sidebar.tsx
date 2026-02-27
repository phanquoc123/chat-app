"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import { useThemeStore } from "@/stores/useThemeStore";
import DirectChatList from "../chat/DirectChatList";
import { useAuthStore } from "@/stores/useAuthStore";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const {isDark, toggleTheme} = useThemeStore()
  const {user} = useAuthStore();
  return (
    <Sidebar
      variant="inset"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="bg-linear-to-r from-blue-500 to-purple-500 text-white"
            >
              <div className="flex w-full items-center justify-between px-2">
                <h1 className="text-xl font-bold text-white">ChatApp</h1>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sun className="size-4 text-white/80" />
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                  />
                  <Moon className="size-4 text-white/80" />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* new chat group */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* chat groups */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-gray-500 uppercase">Group Chats</SidebarGroupLabel>
          <SidebarGroupAction
            className="cursor-pointer"
            title="New group"
          >
            <NewGroupChatModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* friends */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-gray-500 uppercase">Friends</SidebarGroupLabel>
          <SidebarGroupAction
            className="cursor-pointer"
            title="Add friend"
          >
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectChatList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
        </SidebarFooter>
    </Sidebar>
  );
}

