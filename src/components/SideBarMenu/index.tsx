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
import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

const drawerWidth = 240;

export default function PersistentDrawerLeft({ open }: { open: boolean }) {
  const [expanded, setExpanded] = useState(true);

  const handleClick = () => {
    setExpanded(() => !expanded);
  };
  return (
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
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* Input Icon here */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* Input Icon here */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* Input Icon here */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* Input Icon here */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Suppliers" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* Input Icon here */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem onClick={handleClick} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* Input Icon here */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Add Users" />
                </ListItemButton>
              </List>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Remove Users" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider />
        </div>
        <div className="drawer_bottom_half">
          <Divider />
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
          <List>
            <ListItem disablePadding>
              <ListItemButton>
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
  );
}
