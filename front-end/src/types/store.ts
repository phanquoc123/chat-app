import type { Conversation, Message } from "./chat";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  setAccessToken: (accessToken: string | null) => void;
  signUp: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearState: () => void;
  fetchMe : ()=> Promise<void>;
  refresh: () => Promise<void>;
}

export interface ThemeState{
 isDark:boolean;
 toggleTheme:() => void;
 setTheme:(dark: boolean) => void;
}

export interface ChatState{
  conversations:Conversation[];
  messages:Record<string,{
    items:Message[],
    hasMore:boolean,
    nextCursor?:string | null
  }>
  activeConversationId: string | null;
  conversationLoading: boolean;
  messageLoading:boolean;
  reset : () => void;
  setActiveConversation: (id: string | null) => void;
  fetchConversation: () => Promise<void>
  fetchMessages:(conversationId?: string ) => Promise<void>
  sendDirectMessage:(conversationId: string, content: string, imageUrl?: string) => Promise<void>
  sendGroupMessage:(conversationId: string, content: string, imageUrl?: string) => Promise<void>
}
