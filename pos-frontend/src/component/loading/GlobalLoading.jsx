import React from "react";
import { Spin, Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const GlobalLoading = ({ spinning }) => {
  if (!spinning) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1677ff", // ពណ៌ខៀវដូចរូប
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // ឱ្យវានៅលើគេបង្អស់
        color: "white",
      }}
    >
      {/* Spinning Circle */}
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 80, color: "white" }} spin />
        }
      />

      {/* Text LOADING... */}
      <h1
        style={{
          marginTop: 30,
          color: "white",
          letterSpacing: "4px",
          fontWeight: "bold",
        }}
      >
        LOADING...
      </h1>

      {/* Progress Bar */}
      <div style={{ width: "300px", marginTop: 10 }}>
        <Progress
          percent={85}
          showInfo={false}
          strokeColor="white"
          trailColor="rgba(255,255,255,0.3)"
          status="active"
          strokeWidth={12}
        />
      </div>
    </div>
  );
};

export default GlobalLoading;
