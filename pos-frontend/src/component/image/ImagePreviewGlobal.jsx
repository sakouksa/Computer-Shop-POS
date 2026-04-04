import React from "react";
import { Image } from "antd";
import { usePreviewStore } from "../../store/previewStore"; // ផ្ទៀងផ្ទាត់ Path ទៅកាន់ Store របស់អ្នក

const ImagePreviewGlobal = () => {
  // ទាញយក State ពី Zustand
  const { open, imgUrl, handleClosePreview } = usePreviewStore();

  return (
    <Image
      wrapperStyle={{ display: "none" }}
      preview={{
        visible: open,
        onVisibleChange: (visible) => {
          if (!visible) handleClosePreview(); // បិទវិញតាមរយៈ Zustand
        },
        src: imgUrl,
      }}
    />
  );
};

export default ImagePreviewGlobal;
