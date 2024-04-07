import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import "./SideBarMenu.scss";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function PersistentDrawerLeft({
  open,
  expandedItems,
  setExpandedItems,
  globalUser,
  setGlobalUser,
}: {
  open: boolean;
  expandedItems: any;
  setExpandedItems: any;
  globalUser: any;
  setGlobalUser: any;
}) {
  const handleClick = (key: string) => {
    setExpandedItems(() => ({
      // Set all items to false
      empty: false,
      inventory: false,
      reports: false,
      suppliers: false,
      orders: false,
      users: false,
      // Set the clicked item to true
      [key]: true,
    }));
  };

  const handleLogout = async () => {
    // Logout logic here
    console.log("Logging out...");
    setGlobalUser({});
    await navigate("/");
  };

  const navigate = useNavigate();

  return (
    <div className="sidebarmenu">
      <Box
        sx={{
          width: drawerWidth && open ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth && open ? drawerWidth : 0,
            boxSizing: "border-box",
          },
          transition: "width 0.25s",
          position: "relative",
          height: "100%",
          overflowY: "auto",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <div className="logo_container">
          <img className="logo" src="src/assets/images/logo.jpg" />
        </div>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth && open ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth && open ? drawerWidth : 0,
              boxSizing: "border-box",
            },
            paddingBottom: "24px",
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <div className="drawer_top_half">
            <Divider />
            {/* Dashboard */}
            <List>
              <ListItem
                disablePadding
                onClick={(event) => {
                  handleClick("empty");
                }}
              >
                <ListItemButton onClick={() => navigate("/dashboard")}>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            {/* Inventory */}
            <List>
              <ListItem
                onClick={(event) => {
                  handleClick("inventory");
                }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inventory" />
                  {expandedItems.inventory ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={expandedItems.inventory}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="View Users" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Add User" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Edit User Permissions" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Delete Users" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
            <Divider />
            {/* Reports */}
            <List>
              <ListItem
                onClick={(event) => {
                  handleClick("reports");
                }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                  {expandedItems.reports ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedItems.reports} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="View Users" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Add User" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Edit User Permissions" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Delete Users" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
            <Divider />
            {/* Suppliers */}
            <List>
              <ListItem
                onClick={(event) => {
                  handleClick("suppliers");
                }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Suppliers" />
                  {expandedItems.suppliers ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={expandedItems.suppliers}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="View Users" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Add User" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Edit User Permissions" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Delete Users" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
            <Divider />
            {/* Orders */}
            <List>
              <ListItem
                onClick={(event) => {
                  handleClick("orders");
                }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                  {expandedItems.orders ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedItems.orders} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="View Users" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Add User" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Edit User Permissions" />
                  </ListItemButton>
                </List>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Delete Users" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
            <Divider />
            {/* Users */}
            {(globalUser.user_role == "super_administrator" ||
              globalUser.user_role == "administrator") && (
              <>
                <List>
                  <ListItem
                    onClick={(event) => {
                      handleClick("users");
                    }}
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        {/* Input Icon here */}
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary="Users" />
                      {expandedItems.users ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse
                    in={expandedItems.users}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => navigate("/manageusers")}
                      >
                        <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Manage Users" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </List>
                <Divider />
              </>
            )}
            {/* My Profile */}
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </div>
          <div className="drawer_bottom_half">
            <Divider />
            {/* Settings */}
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            {/* Logout */}
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    {/* Input Icon here */}
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </div>
        </Drawer>
      </Box>
    </div>
  );
}
