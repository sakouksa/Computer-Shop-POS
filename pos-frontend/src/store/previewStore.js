import { create } from "zustand";

export const usePreviewStore = create((set) => ({
  open: false,
  imgUrl: "",
  // Function សម្រាប់បើក Preview (ហៅប្រើពីគ្រប់ Page)
  handleOpenPreview: (url) => {
    set({
      open: true,
      imgUrl: url,
    });
  },
  // Function សម្រាប់បិទ Preview
  handleClosePreview: () => {
    set({
      open: false,
      imgUrl: "",
    });
  },
}));
