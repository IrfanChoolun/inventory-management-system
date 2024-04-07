import "./CommonLayout.scss";
import { useState, createContext } from "react";
import { Layout, Button, theme, Breadcrumb } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import SideBarMenu from "../../components/SideBarMenu";

const { Header, Content } = Layout;

function CommonLayout({
  children,
  pageName,
  breadCrumbText,
  expandedItems,
  setExpandedItems,
  globalUser,
  setGlobalUser,
}: {
  children: React.ReactNode;
  pageName: string;
  breadCrumbText: string;
  expandedItems: any;
  setExpandedItems: any;
  globalUser: any;
  setGlobalUser: any;
}) {
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen((o) => !o);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className={`${pageName} full`}>
      <Layout
        className="full"
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <SideBarMenu
          open={open}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          globalUser={globalUser}
          setGlobalUser={setGlobalUser}
        />
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
            {/* <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>{breadCrumbText}</Breadcrumb.Item>
            </Breadcrumb> */}
            <Content
              style={{
                padding: 24,
                minHeight: 280,
                marginTop: 22,
                background: colorBgContainer,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default CommonLayout;
