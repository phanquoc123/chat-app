import { authService } from "@/services/authService";
import { toast } from "sonner";
import { create } from "zustand";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set,get) => ({
  accessToken: null,
  user: null,
  loading: false,

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
      set({ accessToken: response.accessToken});
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
  }
}));
