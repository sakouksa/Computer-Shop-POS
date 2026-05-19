import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Progress,
  Avatar,
  Badge,
  Button,
  Tooltip,
} from "antd";
import {
  ShoppingOutlined,
  LaptopOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  BellOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
import apple from "../../assets/image/apple/apple1.jpg";
import acer from "../../assets/image/acer/acer1.jpg";
import msi from "../../assets/image/msi/msi1.jpg";
const Dashboard = () => {
  // logic for Stats Cards
  const stats = [
    {
      title: "Revenue",
      val: "$45,285",
      icon: <ShoppingOutlined />,
      color: "#3b82f6",
    },
    {
      title: "Purchases",
      val: "$18,400",
      icon: <LaptopOutlined />,
      color: "#10b981",
    },
    {
      title: "Expenses",
      val: "$9,200",
      icon: <ThunderboltOutlined />,
      color: "#f43f5e",
    },
    {
      title: "Net Profit",
      val: "$17,685",
      icon: <DesktopOutlined />,
      color: "#8b5cf6",
    },
  ];

  // Logic for Time & Date
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-4 px-6 md:pt-6 md:px-10 font-sans">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title
            level={3}
            className="!m-0 font-bold leading-tight text-slate-800"
          >
            Store Overview
          </Title>
          <Text type="secondary" className="text-xs font-medium">
            {formattedDate} <span className="mx-1 text-gray-300">|</span>{" "}
            {formattedTime}
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((item, idx) => (
          <Col xs={12} lg={6} key={idx}>
            <Card className="rounded-xl border-gray-100 shadow-none hover:border-blue-200 transition-all cursor-default">
              <div className="flex flex-col gap-2">
                <div
                  style={{ color: item.color }}
                  className="text-lg opacity-80"
                >
                  {item.icon}
                </div>
                <Text
                  type="secondary"
                  className="text-[10px] uppercase font-bold tracking-wider"
                >
                  {item.title}
                </Text>
                <div className="flex items-center justify-between">
                  <Title level={4} className="!m-0 font-bold text-slate-800">
                    {item.val}
                  </Title>
                  <Tag
                    color="green"
                    className="m-0 border-none bg-green-50 text-green-600 text-[10px] font-bold"
                  >
                    <ArrowUpOutlined /> 12%
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
