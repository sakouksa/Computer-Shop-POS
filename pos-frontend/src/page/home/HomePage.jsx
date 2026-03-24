import React from "react";
import { Row, Col, Card, Typography } from "antd";
// ប្តូរមកប្រើ React Icons
import { MdOutlineWeekend, MdLeaderboard, MdStorefront } from "react-icons/md";
import { BsPerson } from "react-icons/bs";

const { Text, Title } = Typography;

const DashboardStats = () => {
  const stats = [
    {
      title: "ការកក់ទុក",
      value: "២៨១",
      footer: "+៥៥%",
      footerText: "ធៀបនឹងសប្តាហ៍មុន",
      icon: <MdOutlineWeekend style={{ fontSize: 26, color: "#fff" }} />,
      iconBg: "#333", // ពណ៌ខ្មៅ
    },
    {
      title: "អ្នកប្រើប្រាស់ថ្ងៃនេះ",
      value: "២,៣០០",
      footer: "+៣%",
      footerText: "ធៀបនឹងខែមុន",
      icon: <MdLeaderboard style={{ fontSize: 26, color: "#fff" }} />,
      iconBg: "#49a3f1", // ពណ៌ខៀវ
    },
    {
      title: "ចំណូលសរុប",
      value: "៣៤k",
      footer: "+១%",
      footerText: "ធៀបនឹងម្សិលមិញ",
      icon: <MdStorefront style={{ fontSize: 26, color: "#fff" }} />,
      iconBg: "#66bb6a", // ពណ៌បៃតង
    },
    {
      title: "អ្នកតាមដាន",
      value: "+៩១",
      footer: "",
      footerText: "ទើបតែធ្វើបច្ចុប្បន្នភាព",
      icon: <BsPerson style={{ fontSize: 26, color: "#fff" }} />,
      iconBg: "#ec407a", // ពណ៌ផ្កាឈូក
    },
  ];

  return (
    <Row gutter={[24, 24]} style={{ marginTop: "30px" }}>
      {stats.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
              position: "relative",
              overflow: "visible",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            {/* Floating Icon */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "16px",
                width: "64px",
                height: "64px",
                backgroundColor: item.iconBg,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(0,0,0,.4)",
              }}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div style={{ textAlign: "right" }}>
              <Text type="secondary" style={{ fontSize: "14px", fontFamily: "Kantumruy Pro, sans-serif" }}>
                {item.title}
              </Text>
              <Title level={3} style={{ margin: 0, fontWeight: 700, fontFamily: "Kantumruy Pro, sans-serif" }}>
                {item.value}
              </Title>
            </div>

            <hr style={{ margin: "15px 0", border: "0.5px solid #f0f2f5" }} />

            {/* Footer */}
            <div style={{ fontSize: "14px", fontFamily: "Kantumruy Pro, sans-serif" }}>
              <span style={{ fontWeight: "bold", color: "#4caf50" }}>
                {item.footer}
              </span>{" "}
              <Text type="secondary">{item.footerText}</Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;