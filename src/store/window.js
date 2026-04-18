import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "#constants";

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    // Lock screen state (separate from boot — manual lock has no boot animation)
    isLocked: sessionStorage.getItem("is_locked") === "true" || !sessionStorage.getItem("boot_shown"),
    lockScreen: () => set((state) => { 
      state.isLocked = true; 
      sessionStorage.setItem("is_locked", "true");
    }),
    unlockScreen: () => set((state) => { 
      state.isLocked = false; 
      sessionStorage.setItem("is_locked", "false");
    }),

    openWindow: (windowKey, data = null, clickPosition = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.data = data ?? win.data;
        win.clickPosition = clickPosition;
        win.zIndex = state.nextZIndex;
        state.nextZIndex++;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),

    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZIndex;
        state.nextZIndex++;
      }),
  }))
);

export default useWindowStore;
