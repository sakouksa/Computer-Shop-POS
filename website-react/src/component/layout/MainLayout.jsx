import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Layout, Menu, Space, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import profile from "../../assets/image/profile.jpg";
import { FaUserTag } from "react-icons/fa6";
//Import Icon
import {
  MdProductionQuantityLimits,
  MdDashboardCustomize,
  MdRoundaboutRight,
} from "react-icons/md";
import { AiFillCustomerService } from "react-icons/ai";
import { FaUserFriends, FaUserClock } from "react-icons/fa";
import { BiSolidUserCheck } from "react-icons/bi";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("Dashboard", "/", <MdDashboardCustomize />),
  getItem("Customer", "customer", <AiFillCustomerService />),
  getItem("Product", "product", <MdProductionQuantityLimits />),
  getItem("About", "about", <MdRoundaboutRight />),
  getItem("Role", "role", <BiSolidUserCheck />),
  getItem("User", "sub1", <FaUserFriends />, [
    getItem("User", "/user/list", <FaUserFriends />),
    getItem("Role", "/user/role", <FaUserTag />),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="demo-logo-vertical"
          style={{ height: 32, margin: 16, background: "rgba(255,255,255,.2)" }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <div className="layout-header">
          <Space>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="" className="layout-logo" />
              <div style={{ marginLeft: 10 }}>
                <div className="txt-brandname">UHST</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1 }}>
                  Build IT skill
                </div>
              </div>
            </div>
            <Input.Search placeholder="Search" />
          </Space>
          <div>
            <Space>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "right", marginRight: 10 }}>
                  <div className="txt-username">Sak Ousa</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1 }}>
                    Admin
                  </div>
                </div>
                <img src={profile} alt="" className="layout-profile" />
              </div>
            </Space>
          </div>
        </div>

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
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
