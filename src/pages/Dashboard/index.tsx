import "./Dashboard.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../utils/UserService";
import { useSelector } from "react-redux";
import {
  Layout,
  Menu,
  Button,
  theme,
  Breadcrumb,
  Card,
  MenuProps,
  ConfigProvider,
} from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const items: MenuProps["items"] = [
    { type: "divider" },

    getItem("Navigation One", "sub1", <MailOutlined />, [
      getItem(
        "Item 1",
        "g1",
        null,
        [getItem("Option 1", "1"), getItem("Option 2", "2")],
        "group"
      ),
      getItem(
        "Item 2",
        "g2",
        null,
        [getItem("Option 3", "3"), getItem("Option 4", "4")],
        "group"
      ),
    ]),

    { type: "divider" },

    getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),

    { type: "divider" },

    getItem("Navigation Three", "sub4", <SettingOutlined />, [
      getItem("Option 9", "9"),
      getItem("Option 10", "10"),
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),

    { type: "divider" },

    getItem("Group", "grp", <MenuUnfoldOutlined />, [
      getItem("Option 13", "13"),
      getItem("Option 14", "14"),
    ]),

    { type: "divider" },
  ];

  const navigate = useNavigate();
  const users: User = useSelector((state: any) => state.user.value);
  return (
    <div className="dashboard full">
      <Layout className="full">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div>
            <h1>Logo</h1>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorSplit: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            <Menu
              theme="dark"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              items={items}
            />
          </ConfigProvider>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              Content
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default Dashboard;
