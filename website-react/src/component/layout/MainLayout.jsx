import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Input,
  Layout,
  Menu,
  Space,
  theme,
  Avatar,
  Badge,
  Dropdown,
  ConfigProvider,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import profile from "../../assets/image/profile.jpg";
import { FaUserTag } from "react-icons/fa6";
import {
  MdProductionQuantityLimits,
  MdDashboardCustomize,
  MdRoundaboutRight,
} from "react-icons/md";
import { AiFillCustomerService } from "react-icons/ai";
import { FaUserFriends, FaUserClock } from "react-icons/fa";
import { BiSolidUserCheck } from "react-icons/bi";
import { RiCustomerService2Fill } from "react-icons/ri";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("ផ្ទាំងគ្រប់គ្រង", "/", <MdDashboardCustomize />),
  getItem("អតិថិជន", "customer", <RiCustomerService2Fill />),
  getItem("ផលិតផល", "product", <MdProductionQuantityLimits />),
  getItem("អំពីយើង", "about", <MdRoundaboutRight />),
  getItem("តួនាទី", "role", <BiSolidUserCheck />),
  getItem("អ្នកប្រើប្រាស់", "sub1", <FaUserFriends />, [
    getItem("បញ្ជីអ្នកប្រើប្រាស់", "/user/list", <FaUserFriends />),
    getItem("កំណត់តួនាទី", "/user/role", <FaUserTag />),
  ]),
];

const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const notificationItems = [
    {
      key: "header",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 0",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>
            ការជូនដំណឹង
          </span>
          <a style={{ fontSize: "11px", color: "#1890ff" }}>អានទាំងអស់</a>
        </div>
      ),
      type: "group",
    },
    { type: "divider" },
    {
      key: "1",
      label: (
        <Space align="start" style={{ padding: "8px 0" }}>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
          <div>
            <div style={{ fontWeight: 500, fontSize: "13px" }}>
              សួស្តី! មានការកម្ម៉ង់ថ្មី #8892
            </div>
            <div style={{ fontSize: "11px", color: "#8c8c8c" }}>២ នាទីមុន</div>
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              background: "#1890ff",
              borderRadius: "50%",
              marginTop: 6,
            }}
          />
        </Space>
      ),
    },
    { type: "divider" },
    {
      key: "all",
      label: (
        <div
          style={{
            textAlign: "center",
            padding: "4px 0",
            color: "#1890ff",
            fontWeight: 500,
            fontSize: "13px",
          }}
        >
          មើលការជូនដំណឹងទាំងអស់
        </div>
      ),
    },
  ];

  return (
    // ប្រើ ConfigProvider ដើម្បីប្តូរស្ទាយ Menu ឱ្យដូច Shadcn
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#332f2e", // ពណ៌ត្នោតដិតដូចក្នុងរូបភាព
            itemSelectedColor: "#ffffff",
            itemHoverBg: "#f1f5f9",
            itemColor: "#64748b",
            itemMarginInline: 12,
            itemBorderRadius: 8,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <style>
          {`
            .ant-layout-sider {
              background-color: #f8f9fa !important;
              border-right: 1px solid #e5e7eb;
            }
            .ant-menu-root {
              border-inline-end: none !important;
            }
            .section-label {
              padding: 20px 24px 8px;
              font-size: 11px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
            }
          `}
        </style>

        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={260}
          theme="light" // ប្តូរទៅ Light ដើម្បីងាយស្រួលយោងពណ៌
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              marginBottom: 0,
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#1a1a1a",
                fontWeight: "bold",
                fontSize: "18px",
                textAlign: "center",
                display: "block",
              }}
            >
              {!collapsed ? "Admin Panel" : "S"}
            </span>
          </div>
          <Menu
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
            onClick={(item) => navigate(item.key)}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0 24px",
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 4px rgba(0, 21, 41, 0.08)",
              zIndex: 1,
            }}
          >
            <Space size={24}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
                <div style={{ marginLeft: 12, lineHeight: 1.2 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "#1890ff",
                    }}
                  >
                    UHST
                  </div>
                  <div style={{ fontSize: 11, color: "#8c8c8c" }}>
                    កសាងជំនាញអាយធី
                  </div>
                </div>
              </div>
              <Input.Search
                placeholder="ស្វែងរកអ្វីមួយនៅទីនេះ..."
                allowClear
                style={{ width: 250 }}
              />
            </Space>

            <Space size={20}>
              <Dropdown
                menu={{ items: notificationItems }}
                placement="bottomRight"
                trigger={["click"]}
                arrow
              >
                <Badge count={5} size="small" style={{ cursor: "pointer" }}>
                  <div
                    style={{
                      padding: "8px",
                      borderRadius: "50%",
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <BellOutlined style={{ fontSize: 20, color: "#595959" }} />
                  </div>
                </Badge>
              </Dropdown>
              <div style={{ height: 24, width: 1, background: "#f0f0f0" }} />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "ព័ត៌មានផ្ទាល់ខ្លួន",
                      icon: <UserOutlined />,
                    },
                    { key: "2", label: "ការកំណត់", icon: <SettingOutlined /> },
                    { type: "divider" },
                    {
                      key: "3",
                      label: "ចាកចេញ",
                      icon: <LogoutOutlined />,
                      danger: true,
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: 10,
                  }}
                >
                  <div style={{ textAlign: "right", lineHeight: 1.2 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#262626",
                      }}
                    >
                      សាក់ ឧស្សាហ៍
                    </div>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                      អ្នកគ្រប់គ្រង
                    </div>
                  </div>
                  <Avatar
                    src={profile}
                    size={40}
                    style={{ border: "2px solid #e6f7ff" }}
                  />
                </div>
              </Dropdown>
            </Space>
          </Header>

          <Content style={{ margin: "0 16px" }}>
            <div
              style={{
                padding: 24,
                minHeight: 600,
                marginTop: 10,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ UHST ©{new Date().getFullYear()}{" "}
            រៀបចំដោយក្រុមការងារ IIT
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
