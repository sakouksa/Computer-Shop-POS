import { List } from "antd";
import { create } from "zustand";

export const countStore = create((set) => ({
  count: 10, //state
  category: [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
  ],
  loading:false,
  increase: () => set((pre) => ({ count: pre.count + 1 })),
  decrease: () => set((pre) => ({count: pre.count -1})),
  reset: () => set({ count: 0,category:[] }),
  update: (value) => set({ count: value }),
}));
