import React from "react";
import { Button, Result, ConfigProvider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const RouteNoFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "#fff", // ប្តូរមកពណ៌សឱ្យមើលទៅស្អាតបែប Simple
      }}
    >
      <Result
        status="404"
        title={
          <span
            style={{
              fontSize: "80px",
              fontWeight: "800",
              color: "#1a1a1a", // ពណ៌ខ្មៅដិត បែប Modern
              lineHeight: 1,
            }}
          >
            404
          </span>
        }
        subTitle={
          <div style={{ marginTop: "10px" }}>
            <h2
              style={{ color: "#1a1a1a", fontWeight: "600", fontSize: "22px" }}
            >
              រកមិនឃើញទំព័រ!
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              សុំទោស! ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាននៅក្នុងប្រព័ន្ធ
              ឬត្រូវបានផ្លាស់ប្តូរអាសយដ្ឋាន។
            </p>
          </div>
        }
        extra={
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{
              borderRadius: "8px",
              height: "45px",
              padding: "0 30px",
              background: "#d4af37", // ពណ៌មាសដែលអ្នកចូលចិត្ត
              border: "none",
            }}
          >
            ត្រឡប់ទៅទំព័រដើម
          </Button>
        }
      />
    </div>
  );
};

export default RouteNoFound;
