import { authService } from "@/services/authService";
import { toast } from "sonner";
import { create } from "zustand";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set,get) => ({
  accessToken: null,
  user: null,
  loading: false,
  setAccessToken: (accessToken) => set({ accessToken }),

  clearState: () => set({ accessToken: null, user: null ,loading: false}),

  signUp: async (firstName, lastName, username, email, password) => {
    try {
      set({ loading: true });
      await authService.signUp(firstName, lastName, username, email, password);
      toast.success("Account created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong when creating account");
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (username, password) => {
    try {
      set({ loading: true });
      const response = await authService.signIn(username, password);
      get().setAccessToken(response.accessToken);
      await get().fetchMe();
      toast.success("Signed in successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong when signing in");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
     try {

        await authService.signOut();
        get().clearState();
        toast.success("Signed out successfully");
     } catch (error) {
        console.log(error);
        toast.error("Something went wrong when signing out");
     }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user =  await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.log(error);
      set({ user: null , accessToken: null});
      toast.error("Something went wrong when fetching user data");
    } finally {
      set({ loading: false });
    }

    
},
refresh:async()=>{

  try {
    set({ loading: true });
    const { user, fetchMe, setAccessToken } = get();
   
    const accessToken = await authService.refresh();
    setAccessToken(accessToken);
     if (!user) return await fetchMe();
  } catch (error) {
    console.log(error);
    toast.error("Session expired. Please sign in again.");
    get().clearState();
  }finally{
    set({ loading: false });
  }
}
}));
