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
