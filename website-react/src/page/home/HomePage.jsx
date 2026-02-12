import React from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  UserOutlined,
  DashboardOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography, Space, Avatar } from "antd";

const { Text } = Typography;

const DashboardStats = () => {
  return (
    <Row gutter={[24, 24]}>
      {/* Card 1: អ្នកប្រើប្រាស់សកម្ម */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          hoverable
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Statistic
              title={
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  អ្នកប្រើប្រាស់សកម្ម
                </Text>
              }
              value={11.28}
              precision={2}
              valueStyle={{
                color: "#1a1a1a",
                fontWeight: 800,
                fontSize: "24px",
              }}
              prefix={
                <ArrowUpOutlined
                  style={{ fontSize: "16px", color: "#3f8600" }}
                />
              }
              suffix="%"
            />
            <Avatar
              size={48}
              shape="rounded"
              icon={<UserOutlined style={{ color: "#1890ff" }} />}
              style={{ backgroundColor: "#e6f7ff", borderRadius: "12px" }}
            />
          </div>
          <div style={{ marginTop: "12px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <Text strong style={{ color: "#3f8600" }}>
                +2.1%
              </Text>{" "}
              ធៀបនឹងម្សិលមិញ
            </Text>
          </div>
        </Card>
      </Col>

      {/* Card 2: អត្រាទុកចោល */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          hoverable
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Statistic
              title={
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  អត្រាទុកចោល
                </Text>
              }
              value={9.3}
              precision={2}
              valueStyle={{
                color: "#1a1a1a",
                fontWeight: 800,
                fontSize: "24px",
              }}
              prefix={
                <ArrowDownOutlined
                  style={{ fontSize: "16px", color: "#cf1322" }}
                />
              }
              suffix="%"
            />
            <Avatar
              size={48}
              shape="rounded"
              icon={<DashboardOutlined style={{ color: "#ff4d4f" }} />}
              style={{ backgroundColor: "#fff1f0", borderRadius: "12px" }}
            />
          </div>
          <div style={{ marginTop: "12px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <Text strong style={{ color: "#cf1322" }}>
                -1.5%
              </Text>{" "}
              ធៀបនឹងសប្តាហ៍មុន
            </Text>
          </div>
        </Card>
      </Col>

      {/* Card 3: ចំណូលសរុប (Gradient Style) */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          hoverable
          style={{
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1890ff 0%, #003a8c 100%)",
            boxShadow: "0 8px 20px rgba(24, 144, 255, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Statistic
              title={
                <Text
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                >
                  ចំណូលសរុប
                </Text>
              }
              value={4560.5}
              precision={2}
              valueStyle={{ color: "#fff", fontWeight: 800, fontSize: "24px" }}
              prefix="$"
            />
            <Avatar
              size={48}
              icon={<DollarOutlined style={{ color: "#fff" }} />}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
              }}
            />
          </div>
          <div style={{ marginTop: "12px" }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
              គោលដៅខែនេះ: <Text style={{ color: "#fff" }}>$5,000</Text>
            </Text>
          </div>
        </Card>
      </Col>

      {/* Card 4: ការលក់សរុប */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          hoverable
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Statistic
              title={
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  ការលក់សរុប
                </Text>
              }
              value={1240}
              valueStyle={{
                color: "#1a1a1a",
                fontWeight: 800,
                fontSize: "24px",
              }}
            />
            <Avatar
              size={48}
              shape="rounded"
              icon={<ShoppingCartOutlined style={{ color: "#722ed1" }} />}
              style={{ backgroundColor: "#f9f0ff", borderRadius: "12px" }}
            />
          </div>
          <div style={{ marginTop: "12px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              មិថុនា ២០២៦ •{" "}
              <Text strong style={{ color: "#722ed1" }}>
                កើនឡើង
              </Text>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
