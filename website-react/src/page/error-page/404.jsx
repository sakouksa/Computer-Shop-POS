import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const RouteNoFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title={<span style={{ fontWeight: "bold" }}>៤០៤</span>} // ប្រើលេខខ្មែរឱ្យមើលទៅប្លែកភ្នែក
      subTitle={
        <div style={{ fontSize: "16px" }}>
          <strong
            style={{ display: "block", fontSize: "20px", marginBottom: "8px" }}
          >
            រកមិនឃើញទំព័រដែលអ្នកស្នើសុំឡើយ!
          </strong>
          សុំទោស! ទំព័រនេះប្រហែលជាត្រូវបានលុប ឬផ្លាស់ប្តូរទីតាំងថ្មី។
          <br /> សូមពិនិត្យមើលអាសយដ្ឋាន URL ឡើងវិញម្តងទៀត។
        </div>
      }
      extra={
        <Button
          type="primary"
          size="large" // ពង្រីកប៊ូតុងឱ្យធំបន្តិចដើម្បីឱ្យទាក់ទាញ
          onClick={() => navigate("/")}
          style={{ borderRadius: "8px", height: "auto", padding: "8px 24px" }}
        >
          ត្រឡប់ទៅកាន់ទំព័រដើម
        </Button>
      }
    />
  );
};

export default RouteNoFound;
