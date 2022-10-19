import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@material-ui/core";

import DashboardIcon from "@material-ui/icons/Dashboard";
import BookIcon from "@material-ui/icons/Book";
import PostAddIcon from "@material-ui/icons/PostAdd";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ManageHistoryRoundedIcon from "@mui/icons-material/ManageHistoryRounded";
import StorageIcon from "@material-ui/icons/Storage";
import People from "@material-ui/icons/People";
import MoreTimeOutlinedIcon from "@mui/icons-material/MoreTimeOutlined";
import Settings from "@material-ui/icons/Settings";
import { NavLink } from "react-router-dom";
import { useStyles } from "./HeaderStyles";
import useAuth from "../auth";
// import StorageIcon from "@mui/icons-material/Storage";
import Home from "../BodyComponent/home/Home";
import ListRequest from "../BodyComponent/ListRequest/ListRequest";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

export default function SidenavData({ handleDrawerClose }) {
  const classes = useStyles();
  let listItemData;
  const user = useAuth();

  listItemData = [
    // { label: "Dashobard", link: "/dashboard", icon: <DashboardIcon /> },
    { label: "Servers", link: "/servers", icon: <StorageIcon /> },
    // { label: "Approvals", link: "/link", icon: <PostAddIcon /> },
    // { label: "History", link: "/historic", icon: <ManageHistoryRoundedIcon /> },
    // { label: "Users", link: "/user", icon: <People /> },
    // {
    //   label: "server Request",
    //   link: "/serverrequest",
    //   icon: <MoreTimeOutlinedIcon />,
    // },

    // { label: "Settings", link: "/link", icon: <Settings /> },
    // { label: "Login", link: "/", icon: <Settings /> },
    // {
    //   label: "Notification",
    //   link: "/notification",
    //   icon: <NotificationsActiveIcon />,
    // },
    // { label: "Logout", link: "/logout", icon: <ExitToAppIcon /> },
  ];

  if (user.Role === "admin" || user.Role === "infra_admin") {
    listItemData.unshift(
      {
        label: "Dashboard",
        link: "/dashboard",
        icon: <DashboardIcon />,
      },
      
      // {
      //   label: "ListRequest",
      //   link: "/listrequest",
      //   icon: <SummarizeOutlinedIcon />,
      // }
    );
  }
  if (user.Role === "admin" || user.Role === "infra_admin") {
    listItemData.push(
      { label: "Users", link: "/user", icon: <People /> },
      {
        label: "List Request",
        link: "/listrequest",
        icon: <SummarizeOutlinedIcon />,
      },
      {
        label: "History",
        link: "/historic",
        icon: <ManageHistoryRoundedIcon />,
      },
      
      // {
      //   label: "ListRequest",
      //   link: "/listrequest",
      //   icon: <SummarizeOutlinedIcon />,
      // }
    );
  }
  // if (user.Role === "infra_admin") {
  //   listItemData.push(
  //     { label: "Users", link: "/user", icon: <People /> },
  //     {
  //       label: "List Request",
  //       link: "/listrequest",
  //       icon: <SummarizeOutlinedIcon />,
  //     },
  //     {
  //       label: "History",
  //       link: "/historic",
  //       icon: <ManageHistoryRoundedIcon />,
  //     },
  //     // {
  //     //   label: "ListRequest",
  //     //   link: "/listrequest",
  //     //   icon: <SummarizeOutlinedIcon />,
  //     // }
  //   );
  // }
  // if (user.Role === "infra_admin") {
  //   listItemData.unshift(
  //     {
  //       label: "Dashboard",
  //       link: "/dashboard",
  //       icon: <DashboardIcon />,
  //     },
  //     {
  //       label: "History",
  //       link: "/historic",
  //       icon: <ManageHistoryRoundedIcon />,
  //     },
  //     { label: "Users", link: "/user", icon: <People /> },
  //     {
  //       label: "ListRequest",
  //       link: "/listrequest",
  //       icon: <SummarizeOutlinedIcon />,
  //     }
  //   );
  // }
  if (user.Role === "user") {
    listItemData.push(
      {
        label: "Server Request",
        link: "/serverrequest",
        icon: <MoreTimeOutlinedIcon />,
      },
      {
        label: "List Request",
        link: "/listrequestuser",
        icon: <SummarizeOutlinedIcon />,
      }
    );
  }
  // else (user.role === "User") {

  // }
  return (
    <List>
      {listItemData.map((item, i) => (
        <Button
          size="small"
          className={classes.navButton}
          onClick={() => handleDrawerClose()}
          key={i}
        >
          <ListItem
            exact
            component={NavLink}
            to={item.link}
            className={classes.navlinks}
            activeclassname={classes.activeNavlinks}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItem>
        </Button>
      ))}
    </List>
  );
}
