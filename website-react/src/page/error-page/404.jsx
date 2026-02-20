import React from "react";
import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const RouteNoFound = () => {

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        paddingBottom: "100px",
        background: "transparent",
      }}
    >
      <Result
        status="404"
        title={
          <span
            style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#d4af37",
              letterSpacing: "4px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            444
          </span>
        }
        subTitle={
          <div style={{ marginTop: "10px" }}>
            <h2
              style={{ color: "#1a1a1a", fontWeight: "bold", fontSize: "24px" }}
            >
              រកមិនឃើញទំព័រដែលអ្នកស្វែងរក!
            </h2>
            <p style={{ color: "#8c8c8c", fontSize: "16px" }}>
              សុំទោស! ទំព័រដែលអ្នកកំពុងព្យាយាមចូលមើល ប្រហែលជាត្រូវបានផ្លាស់ប្តូរ{" "}
              <br />
              ឬអាសយដ្ឋាន URL មិនត្រឹមត្រូវ។
            </p>
          </div>
        }
      />
    </div>
  );
};

export default RouteNoFound;
