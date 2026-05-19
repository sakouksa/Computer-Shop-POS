import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const profileStore = create(
  persist(
    (set, get) => ({
      profile: null, //state
      access_token: null,
      permission: null,
      setProfile: (params) => set((pre) => ({ profile: params })),
      setAccessToken: (params) => set((pre) => ({ access_token: params })),
      setPermission: (params) => set((pre) => ({ permission: params })),
      logout: () => set((pre) => ({ profile: null, access_token: null })),
    }),
    {
      name: "user-profile", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
