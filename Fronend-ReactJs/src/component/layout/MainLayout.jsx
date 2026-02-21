import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Input,
  Space,
  theme,
  Avatar,
  Badge,
  Dropdown,
  ConfigProvider,
  Typography,
} from "antd";

// --- Import Icons ---
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import {
  MdDashboardCustomize,
  MdPointOfSale,
  MdProductionQuantityLimits,
  MdOutlinePayments,
  MdOutlineLanguage,
  MdOutlineLocationCity,
} from "react-icons/md";

import { RiCustomerService2Fill, RiUserSharedLine } from "react-icons/ri";
import { BiCategoryAlt, BiSolidUserBadge } from "react-icons/bi";
import { AiOutlineShoppingCart, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BsCashStack } from "react-icons/bs";
import { CiCloudOn } from "react-icons/ci";

// Assets
import logo from "../../assets/img/pos.jpg";
import { profileStore } from "../../store/profileStore";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("ផ្ទាំងគ្រប់គ្រង", "/", <MdDashboardCustomize />),
  getItem("ការលក់", "sales", <MdPointOfSale />, [
    getItem("ផ្ទាំងលក់ POS", "/pos", <MdPointOfSale />),
    getItem("បញ្ជីលក់/វិក្កយបត្រ", "/orders", <AiOutlineShoppingCart />),
  ]),

  getItem(
    "របាយការណ៍",
    "report",
    <MdDashboardCustomize style={{ color: "#d4af37" }} />,
    [
      getItem("របាយការណ៍លក់", "/report/to_sales", <BsCashStack />),
      getItem("បញ្ជីវិក្កយបត្រ", "/order", <FileTextOutlined />),
      getItem("របាយការណ៍ទិញចូល", "/report/purchase", <AiOutlineShoppingCart />),
      getItem("របាយការណ៍ចំណាយ", "/report/expense", <MdOutlinePayments />),
    ],
  ),

  getItem("អតិថិជន", "customer", <RiCustomerService2Fill />, [
    getItem("បញ្ជីអតិថិជន", "/customer", <AiOutlineUsergroupAdd />),
    getItem("ប្រភេទអតិថិជន", "/customer_type", <BiCategoryAlt />),
  ]),

  getItem("សារពើភ័ណ្ឌ", "inventory", <MdProductionQuantityLimits />, [
    getItem("បញ្ជីផលិតផល", "/product", <MdProductionQuantityLimits />),
    getItem("ប្រភេទផលិតផល", "/category", <BiCategoryAlt />),
  ]),

  getItem("ការទិញចូល", "purchase", <CiCloudOn />, [
    getItem("បញ្ជីទិញចូល", "/purchase", <AiOutlineShoppingCart />),
    getItem("អ្នកផ្គត់ផ្គង់", "/supplier", <RiUserSharedLine />),
  ]),

  getItem("ចំណាយផ្សេងៗ", "expense", <BsCashStack />, [
    getItem("បញ្ជីចំណាយ", "/expense", <MdOutlinePayments />),
    getItem(
      "ប្រភេទចំណាយ",
      "/expense-type",
      <BiCategoryAlt style={{ color: "#d4af37" }} />,
    ),
  ]),

  getItem("បុគ្គលិក", "employee", <AiOutlineUsergroupAdd />, [
    getItem("បញ្ជីបុគ្គលិក", "/employee", <UserOutlined />),
    getItem(
      "បើកប្រាក់បៀវត្ស",
      "/payroll",
      <BsCashStack style={{ color: "#d4af37" }} />,
    ),
  ]),

  getItem("អ្នកប្រើប្រាស់", "user", <UserOutlined />, [
    getItem("បញ្ជីអ្នកប្រើប្រាស់", "/list", <UserOutlined />),
    getItem("កំណត់តួនាទី", "/role", <BiSolidUserBadge />),
    getItem("សិទ្ធិប្រើប្រាស់", "/permission", <SafetyCertificateOutlined />),
  ]),

  getItem("ការកំណត់", "settings", <SettingOutlined />, [
    getItem("ភាសា", "/lang", <MdOutlineLanguage />),
    getItem("ខេត្ត/ក្រុង", "/province", <MdOutlineLocationCity />),
    getItem("រូបិយវត្ថុ", "/currency", <BsCashStack />),
    getItem(
      "វិធីសាស្ត្រទូទាត់ប្រាក់",
      "/payment_method",
      <MdOutlinePayments />,
    ),
  ]),
];

const MainLayout = () => {
  const { profile, logout } = profileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [openKeys, setOpenKeys] = useState([]);

  // Function សម្រាប់គ្រប់គ្រងការបើក/បិទ Submenu ឱ្យបង្ហាញតែមួយក្នុងពេលតែមួយ
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    const rootSubmenuKeys = [
      "sales",
      "report",
      "customer",
      "inventory",
      "purchase",
      "expense",
      "employee",
      "user",
      "settings",
    ];

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    if (path) setOpenKeys([path]);
  }, [location.pathname]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  if (!profile) {
    return null;
  }

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
        </Space>
      ),
    },
  ];
  //Profile
  const items_drop_image = [
    {
      type: "group",
      label: (
        <div style={{ padding: "4px 4px", cursor: "default" }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
              lineHeight: "1.5",
            }}
          >
            {profile?.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 400,
            }}
          >
            {profile?.role}
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "1",
      label: "ប្រវត្តិរូប",
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "ការកំណត់",
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: "ចាកចេញ",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#332f2e",
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
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={280}
          theme="light"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1001,
            boxShadow: "2px 0 8px 0 rgba(29,33,41,.05)",
            borderRight: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              borderBottom: "1px solid #f0f0f0",
              background: "#fff",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 8 }}
            />
            {!collapsed && (
              <span
                style={{
                  marginLeft: 12,
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#1a1a1a",
                  whiteSpace: "nowrap",
                }}
              >
                ខេ-ឃែសកុំព្យូទ័រ <span style={{ color: "#d4af37" }}>POS</span>
              </span>
            )}
          </div>

          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[location.pathname]}
            items={items}
            onClick={(item) => navigate(item.key)}
            style={{ borderInlineEnd: "none", marginTop: 8 }}
          />
        </Sider>

        <Layout
          style={{ marginLeft: collapsed ? 80 : 280, transition: "all 0.2s" }}
        >
          <Header
            style={{
              padding: "0 24px",
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              width: "100%",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Space size={24}>
              <Input
                placeholder="ស្វែងរកទិន្នន័យ..."
                prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
                style={{
                  width: 320,
                  borderRadius: "10px",
                  background: "#ffffff",
                  border: "1px solid #d9d9d9",
                  height: "35px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  fontSize: "14px",
                }}
                className="custom-search-input"
              />
            </Space>

            <Space size={16}>
              <Dropdown menu={{ items: notificationItems }} trigger={["click"]}>
                <Badge count={5} size="small" offset={[-2, 5]}>
                  <div
                    style={{
                      padding: 8,
                      cursor: "pointer",
                      borderRadius: "50%",
                      background: "#f5f5f5",
                      display: "flex",
                    }}
                  >
                    <BellOutlined style={{ fontSize: 18, color: "#595959" }} />
                  </div>
                </Badge>
              </Dropdown>

              <div
                style={{
                  height: 20,
                  width: 1,
                  background: "#f0f0f0",
                  margin: "0 8px",
                }}
              />

              {/* Profile */}
              <Dropdown
                menu={{
                  items: items_drop_image,
                  onClick: (item) => {
                    if (item.key === "logout") {
                      navigate("login");
                      logout();
                    }
                  },
                }}
                placement="bottomRight"
              >
                <Space
                  style={{
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 8,
                  }}
                  className="user-dropdown-link"
                >
                  <Avatar
                    src={profile?.image}
                    size={40}
                    style={{
                      border: "2px solid #e6f7ff",
                      backgroundColor: "#87d068",
                    }}
                    icon={<UserOutlined />}
                  />
                  {!collapsed && (
                    <div style={{ lineHeight: 1.2 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: "#1f1f1f",
                        }}
                      >
                        {profile?.name}
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {profile?.role}
                      </Text>
                    </div>
                  )}
                </Space>
              </Dropdown>
            </Space>
          </Header>

          <Content style={{ margin: "20px 20px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: "calc(100vh - 170px)",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer
            style={{ textAlign: "center", color: "#94a3b8", fontSize: 12 }}
          >
            KHMER CASH POS SYSTEM ©{new Date().getFullYear()} -
            គ្រប់គ្រងអាជីវកម្មបែបឆ្លាតវៃ
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
