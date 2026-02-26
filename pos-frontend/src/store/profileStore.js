import { create } from "zustand";
import profile_image from "../assets/img/profile.jpg";

export const profileStore = create((set) => ({
  profile: null,
  setProfile: (params) => set((pre) => ({ profile: params })),
  logout: (params) => set((pre) => ({ profile: null })),
}));

