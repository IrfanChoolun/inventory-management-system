import "./Dashboard.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../utils/UserService";
import { useSelector } from "react-redux";
import { Layout, Button, theme, Breadcrumb } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import SideBarMenu from "../../components/SideBarMenu";

const { Header, Content } = Layout;

function Dashboard() {
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen((o) => !o);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const users: User = useSelector((state: any) => state.user.value);
  return (
    <div className="dashboard full">
      <Layout
        className="full"
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <SideBarMenu open={open} />
        <Layout>
          <Header>
            <Button
              type="text"
              icon={open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleDrawer}
              style={{
                fontSize: "16px",
                width: 36,
                height: 36,
              }}
              className="collapse_sidemenu"
            />
          </Header>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
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
