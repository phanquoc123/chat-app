import type { ThemeState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

function applyThemeToDocument(isDark: boolean) {
  if (typeof document === "undefined") return;
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const newValue = !get().isDark;
        set({ isDark: newValue });
        applyThemeToDocument(newValue);
      },
      setTheme: (dark: boolean) => {
        set({ isDark: dark });
        applyThemeToDocument(dark);
      },
    }),
    {
      name: "theme-storage",
   
      onRehydrateStorage: () => (state) => {
        if (state?.isDark != null) {
          applyThemeToDocument(state.isDark);
        }
      },
    }
  )
);
