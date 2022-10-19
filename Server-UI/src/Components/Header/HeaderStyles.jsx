import { makeStyles } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { blue } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    // flexFlow: "row wrap",
    justifyContent: "space-between",
  },
  logo: {
    color: "white",
  },
  navlist: {
    minWidth: "250px",
    maxWidth: "300px",
  },
  ulAvater: {
    backgroundColor: blue["A200"],
    color: "white",
  },
  navAvatar: {
    width: "35px",
    height: "35px",
  },

  // user
  addUser: {
    width: "40px",
    height: "40px",
    marginTop: "20px",
    marginBottom: "20px",
  },
  addUserFormHeading: {
    fontSize: "21px",
    marginBottom: "20px",
    marginTop: "20px",
  },
  // addUserBtn: {
  //   marginTop: "18px",
  //   marginBottom: "10px",
  // },
  // cancelUSerBtn: {
  //   marginTop: "18px",
  //   marginBottom: "10px",
  //   marginLeft: "10px",
  // },

  addUserBtn: {
    margin: theme.spacing(3, 0, 3, 0),
    // background: "#00e676",
    background: "#1a73e8",
    color: "#fff",
    '&:hover': {
      background: "#135cbc",
   },
  },
  cancelUserBtn: {
    margin: theme.spacing(3, 0, 3, 3),
    background: "#efefef",
    '&:hover': {
      background: "#fff",
   },

  },

  addusertemplate: {
    height: "40px",
    width: "50px",
  },

  //wrapper of main contianer
  wrapper: {
    minHeight: "100vh",
    height: "auto",
    background: "#efefef",
    marginTop: "60px",
    padding: theme.spacing(2, 2, 0, 2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 2),
      marginTop: "45px",
    },
  },

  //Side nav
  drawerPaper: {
    width: "250px",
    marginTop: "65px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "0px",
    },
  },
  navlinks: {
    color: blueGrey["A400"],
    "& :hover , &:hover div": {
      color: blue["A200"],
    },
    " & div": {
      color: blueGrey["A400"],
    },
  },
  activeNavlinks: {
    color: blue["A700"],
    "& div": {
      color: blue["A700"],
    },
  },
  navButton: {
    width: " 100%",
    textTransform: "capitalize",
  },
  add: {
    margin: theme.spacing(3, 0, 3, 0),
    // background: "#00e676",
    background: "#1a73e8",
    color: "#fff",
    '&:hover': {
      background: "#135cbc",
   },
  },
  cancel: {
    margin: theme.spacing(3, 0, 3, 3),
    background: "#efefef",
    '&:hover': {
      background: "#fff",
   },

  },

  muiHeadd: {
    minWidth: "200px",
    // height: "50px",
  },
}));
