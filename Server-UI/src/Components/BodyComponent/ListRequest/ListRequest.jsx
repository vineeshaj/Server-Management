import MUIDataTable from "mui-datatables";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded";
// import Swal from "sweetalert2/dist/sweetalert2.js";
import swal from "sweetalert";
// import "sweetalert2/src/sweetalert2.scss";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  CssBaseline,
  Dialog,
  Grid,
  InputLabel,
  Select,
} from "@material-ui/core";
import DnsIcon from "@mui/icons-material/Dns";
import EditIcon from "@mui/icons-material/Edit";
// import { useStyles } from "../../Header/HeaderStyles";
import { useStyles } from "../BodyStyles";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import image from "../../../img/adduser1.png";
import image from "../../../img/adduser2.jpg";
//--------------/Add user------------------

//--------------Add user pop-up --------------

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MaterialTable from "material-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { id } from "date-fns/locale";
import api from "../../../utils/api";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// toast.configure();

//--------------Add user pop-up --------------

const ListRequest = () => {
  const [openModel3, setOpenModel3] = React.useState(false);
  const [uservalue, setUservalue] = React.useState({});
  const [openModel4, setOpenModel4] = React.useState(false);
  const [openModel5, setOpenModel5] = React.useState(false);
  const classes = useStyles();
  const handleModel5Open = (s) => {
    setOpenModel5(true);
    console.log(s, "Required Value");
  };
  const handleModel5Close = () => {
    setOpenModel5(false);
  };
  const handleModel4Open = (s) => {
    setOpenModel4(true);
    console.log(s, "Required Value");
  };
  const handleModel4Close = () => {
    setOpenModel4(false);
  };
  const handleModel3Open = (s) => {
    setOpenModel3(true);
    setUservalue(s);
  };
  const handleModel3Close = () => {
    setOpenModel3(false);
  };
  const platformFn = (s) => {
    // usercomment();
    handleModel3Open(s);
    console.log(s, "row server id");
  };

  const infcmt = (s) => {
    // handleModel3Open();
    // submitcomment(e);
    handleModel4Open(s);
  };
  const add = (s) => {
    // handleModel3Open();
    // submitcomment(e);
    handleModel5Open(s);
  };

  const columns = [
    {
      name: "Id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
        // show: false,
        display: false,
        // hideHeader: false,
        // setCellProps: () => ({
        //   style: {
        //     display: "none",
        //   },
        // }),
      },
    },
    {
      name: "Sl no",
      label: "SL.NO",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = Number(tableMeta.rowIndex) + 1;
          return <span>{rowIndex}</span>;
        },
        // setCellProps: () => {
        //   return { align: "center" };
        // },
        setCellProps: () => ({
          style: {
            minWidth: "80px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },

    {
      name: "Creator",
      label: " Creator",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "120px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    // {
    //   name: "Asset_ID",
    //   label: "Asset ID",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    {
      name: "Start_Date",
      label: "Start Date",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "End_Date",
      label: " End Date",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Manufacturer",
      label: " Manufacturer",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Number_Of_Servers",
      label: "Number Of Servers",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Operating_System",
      label: " Operating_System",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Cpu_model",
      label: "Cpu model",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "150px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "CPU_Sockets",
      label: "CPU_Sockets",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "DIMM_Size",
      label: "DIMM Size",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "DIMM_Capacity",
      label: "DIMM_Capacity ",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Storage_Vendor",
      label: "Storage Vendor",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Storage_Controller",
      label: "Storage Controller",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Storage_Capacity",
      label: "Storage Capacity",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Number_Of_Network_Ports",
      label: "Number Of Network Ports",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Network_speed",
      label: "Network speed",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Network_Type",
      label: "Network Type",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(value);
          if (value === false) {
            return (
              <>
                <div className="activeClass">
                  <span>Private</span>
                </div>
              </>
            );
          } else {
            return (
              <>
                <div className="inactiveClass">
                  <span>Public</span>
                </div>
              </>
            );
          }
        },
      },
    },
    {
      name: "Special_Switching_Needs",
      label: "Special Switching Needs",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "200",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },

    {
      name: "User_Comments",
      label: "User comments",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              //   className="ppBtnClass"
              // onChange={() => console.log(value, tableMeta.rowData[0])}
              onClick={() => platformFn(tableMeta.rowData[19])}
            >
              <MarkUnreadChatAltRoundedIcon />
            </button>
          );
        },
        setCellProps: () => ({
          style: {
            minWidth: "80px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Infraadmin_Comments",
      label: "Infra admin comment",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              //   className="ppBtnClass"
              // onChange={() => console.log(value, tableMeta.rowData[0])}
              onClick={() => infcmt(tableMeta.rowData[0])}
            >
              <MarkUnreadChatAltRoundedIcon />
            </button>
          );
        },
        setCellProps: () => ({
          style: {
            minWidth: "80px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Add Asset",
      label: "Add Asset",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              //   className="ppBtnClass"
              // onChange={() => console.log(value, tableMeta.rowData[0])}
              onClick={() => add(tableMeta.rowData[0])}
            >
              <DnsIcon />
            </button>
          );
        },
        setCellProps: () => ({
          style: {
            minWidth: "80px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
      },
    },
  ];

  //----------------------- /Add User-----------------

  const [userRole, setUserRole] = useState("");

  const handleUserRole = () => {
    // setUserRole(event.target.value);
  };
  console.log(userRole, "userRole");

  //------------------------ Add User Pop-up ---------

  const [usersData, setUsersData] = React.useState([]);
  // const [updatedUsers, setUpdatedUsers] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editUserOpen, setEditUserOpen] = React.useState(false);

  const handleEditUserOpen = () => {
    setEditUserOpen(true);
  };
  const handleEditUserClose = () => {
    setEditUserOpen(false);
  };
  const [update, updateUser] = React.useState(false);
  const handleUpdate = () => updateUser(true); //onClick={() => { handleOpen(); handleChange() }}
  // const handleUpdate ={() => { updateUser(true); handleRowClick(); }};
  const handleCloseUpdate = () => updateUser(false);

  const handleRowClick = (rowData, rowMeta) => {
    handleUpdate();
    console.log(rowData);
  };
  //------------------------ Add User Pop-up ---------

  const options = {
    filterType: "checkbox",
    print: false,
    selectableRows: false,
    rowsPerPage: [5],
    rowsPerPageOptions: [3, 5, 10, 15],
    viewColumns: false,
    responsive: "standard",
    downloadOptions: {
      filename: "List request.csv",
      filterOptions: {
        useDisplayedColumnsOnly: true,
      },
    },
  };

  // const handleUserUpdate = (updatedRows) => {
  //   setUpdatedUsers(updatedRows);
  //   console.log(updatedUsers);
  // };

  const handleAddUser = () => {
    handleClose();
    setUser();
    console.log();
  };

  // }, []);
  useEffect(() => {
    getUsersUrl();
  }, []);
  const getUsersUrl = async () => {
    const res = await api.get("list_request");
    setUsersData(res.data.Listusers);
    console.log("mm", res);
  };
  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );
  const [Infraadmin_Comments, setInfraadmin_Comments] = useState(" ");

  function submitcomment(e) {
    e.preventDefault();
    let a = {
      Infraadmin_Comments: Infraadmin_Comments,
    };
    console.log("data", a);
    // console.log(a, "a");
    api
      .post("update_ia_comments", a)
      .then((res) => {
        // setData(res.data);
        console.log("res", res);
        // toast.success("add susses");
        // alert("message added");
        swal(res.data.Message, {
          buttons: false,
          timer: 3000,
        });
        handleModel4Close();

        // history.push('/login')
      })
      .catch((err) => {
        console.log(err);

        alert("error added");
      })
      .catch(function (error) {
        // console.log(error.response.status) // 401
        // console.log(error.response.data) //Please Authenticate or whatever returned from server
        if (error.response.status === 401) {
          console.log(error.response.data.Message); //Please Authenticate or whatever returned from server
          swal(error.response.data.Message, {
            icon: "warning",
            buttons: false,
            timer: 3000,
          });
          //redirect to login
        } else if (error.response.status === 400) {
          console.log(error.response.data.Message); //Please Authenticate or whatever returned from server
          swal(error.response.data.Message, {
            icon: "warning",
            buttons: false,
            timer: 3000,
          });
        } else {
          console.log(error.response.data.Message); //Please Authenticate or whatever returned from server
          swal(error.response.data.Message, {
            icon: "warning",
            buttons: false,
            timer: 3000,
          });
        }
      });
    // handleModel4Close();
    // if (!post) return "No post!";
  }

  ////add sever ///
  // const AddAsset = (e) => {
  //   // e.preventDefault();
  //   let assetdetail = {
  //     // usersData,
  //     id: usersData.id,
  //   };
  //   console.log("data i want now ", assetdetail);
  // };
  const [data, setData] = useState({
    // Asset_Id: "",
    Asset_Name: "",
    Manufacturer: "",
    BMC_IP: "",
    BMC_User: "",
    BMC_Password: "",
    Asset_Location: "",
    Created_on: "",
    Created_by: user.Username,
    OS_IP: "",
    OS_User: "",
    OS_Password: "",
    Purpose: "",
    Cluster_Id: "",
  });

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }
  const Sub = async (e) => {
    e.preventDefault();
    // console.log("ig");
    // console.log(data, "ig");
    // console.log(data.Created_on, "ig");
    // console.log(data.Manufacturer, "ig");
    // console.log(date, "created on");
    // let dateTime = new Date(date).toISOString();
    // console.log(new Date(date).toISOString(), "created on");
    // let toStringDate = new Date(date).toISOString().split("-");
    // // console.log(toStringDate[2].slice(0, 2));
    // let createdDate =
    //   toStringDate[2].slice(0, 2) +
    //   "-" +
    //   toStringDate[1] +
    //   "-" +
    //   toStringDate[0];
    // console.log(createdDate, "createdDate");
    // console.log(typeof createdDate);
    // console.log(data.assigned_on, "ig");
    let postData = {
      // Asset_Id: parseInt(data.Asset_Id),
      Asset_Name: data.Asset_Name,
      Manufacturer: data.Manufacturer,
      BMC_IP: data.BMC_IP,
      BMC_User: data.BMC_User,
      BMC_Password: data.BMC_Password,
      Asset_Location: data.Asset_Location,
      // Created_on: createdDate,
      // Created_on: dateTime,
      Created_by: data.Created_by,
      OS_IP: data.OS_IP,
      OS_User: data.OS_User,
      OS_Password: data.OS_Password,
      Purpose: data.Purpose,
      Cluster_Id: data.Cluster_Id,
      // Delete: 1,
    };
    // console.log(postData, "postData");

    // axios.post(url, postData).then(
    await api
      .post("add_asset", postData)
      .then(
        (res) => {
          if (res.status === 200) {
            console.log(res.data);
            //   reset();
            // alert(res.data.Message);
            swal(res.data.Message, {
              buttons: false,
              timer: 3000,
            });
            // setOpen(false);
            // reservedAssetApi();
            // setValue("2");

            // poolAssetApi();

            handleModel5Close();
            // alert("We got your information. We will call you back soon.");
          } else if (res.status === 202) {
            // alert(res.data.Message);
            swal(res.data.Message);
            // console.log(res.data.Message);
          } else {
            alert("Something went wrong...Server Error!!");
          }
        },
        (error) => {
          // console.log(error);
          swal(error.message, {
            // buttons: false,
            timer: 3000,
          });
          // alert("Refused Connection...Try again later", error);
        }
      )
      .catch(function (error) {
        // console.log(error.response.status) // 401
        // console.log(error.response.data) //Please Authenticate or whatever returned from server
        if (error.response.status === 401) {
          console.log(error.response.data.Message); //Please Authenticate or whatever returned from server
          swal(error.response.data.Message, {
            icon: "warning",
            buttons: false,
            timer: 3000,
          });
          //redirect to login
        } else if (error.response.status === 400) {
          console.log(error.response.data.Message); //Please Authenticate or whatever returned from server
          swal(error.response.data.Message, {
            icon: "warning",
            buttons: false,
            timer: 3000,
          });
        } else {
          console.log(error.response.data.Message); //Please Authenticate or whatever returned from server
          swal(error.response.data.Message, {
            icon: "warning",
            buttons: false,
            timer: 3000,
          });
        }
      });
  };

  return (
    <>
      <Dialog open={openModel3} className={classes.dialog}>
        <Container
          component="main"
          className={classes.dialogplatformContainer}
          style={{ alignContent: "center" }}
        >
          {/* <CssBaseline /> */}
          {/* <div className={classes.dialogPaper}> */}
          <Typography component="h1" variant="h6" class="mt-2" align="center">
            User comments
          </Typography>

          <div class="platformData mt-4">
            {/* <ReactJson src={platformInfo} theme="monokai" /> */}
            <div>
              <Container>
                <Card sx={{ minWidth: 300 }}>
                  <CardContent>
                    <ul>{uservalue}</ul>

                    <Typography variant="body2">
                      {/* well meaning and kindly. */}
                      <br />
                      {/* {'"a benevolent smile"'} */}
                    </Typography>
                  </CardContent>
                  <CardActions></CardActions>
                </Card>
              </Container>
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{ width: "25ch" }}
              variant="contained"
              color="primary"
              className={classes.add}
              onClick={handleModel3Close}
              style={{ justifyContent: "center" }}
            >
              Close
            </Button>
          </div>
        </Container>
      </Dialog>

      <Dialog open={openModel4} className={classes.dialog}>
        {/* <Box className={classes.dialogPaper}> */}
        <Container
          component="main"
          className={classes.dialogContainer}
          sx={{ minWidth: 300 }}
        >
          <CssBaseline />
          <div className={classes.dialogPaper} sx={{ minWidth: 300 }}>
            <Typography component="h1" variant="h6">
              Infra Admin Comments
            </Typography>
            {/* <Button variant="contained" >
                Send
              </Button> */}

            <form
              className={classes.form}
              noValidate
              onSubmit={(e) => submitcomment(e)}
              // initialValues={}
              sx={{ minWidth: 300 }}
            >
              <Grid item xs={12} sx={{ minWidth: 300 }}>
                <Grid
                  item
                  xs={15}
                  sx={{ minWidth: 300 }}
                  sm={{ minWidth: 300 }}
                >
                  <TextField
                    variant="outlined"
                    required
                    sx={{ minWidth: 300 }}
                    xs={{ minWidth: 300 }}
                    size="medium"
                    fullWidth="true"
                    id="Infraadmin_Comments"
                    label="Infra Admin Comments"
                    name="Infraadmin_Comments"
                    placeholder="Infraadmin Comments"
                    focused
                    type="text"
                    // value={Infraadmin_Comments}
                    onChange={(e) => setInfraadmin_Comments(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                //   type="submit"
                // fullWidth
                type="submit"
                // value="Submit"
                sx={{ width: "25ch" }}
                variant="contained"
                color="success"
                className={classes.add}
              >
                Save
              </Button>
              <Button
                //   type="submit"
                // fullWidth
                sx={{ width: "25ch" }}
                variant="contained"
                color="primary"
                className={classes.cancel}
                onClick={handleModel4Close}
              >
                Cancel
              </Button>
            </form>
          </div>
        </Container>
      </Dialog>
      <Dialog open={openModel5} className={classes.dialog}>
        {/* <Box className={classes.dialogPaper}> */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            {/* <Avatar className={classes.avatar}></Avatar> */}
            <div className="addassetheaderline">
              <Box m={0}>
                <Typography component="h1" variant="h6" className="addasseth6">
                  Add Asset
                </Typography>
                <Typography component="h1" variant="body2">
                  All fields are mandatory(*). Please fill all the fields before
                  submitting the form.
                </Typography>
              </Box>
            </div>
            {/* <hr /> */}
            <form className={classes.form} onSubmit={(e) => Sub(e)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    // autoComplete="fname"
                    name="Asset_Name"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    fullWidth
                    id="Asset_Name"
                    label="Asset Name"
                    // placeholder="Asset Name"
                    // autoFocus
                    type="text"
                    // value={data.Asset_Name}
                    onChange={(e) => handle(e)}
                    // autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    fullWidth
                    id="Manufacturer"
                    label="Manufacturer"
                    name="Manufacturer"
                    // autoFocus
                    type="text"
                    // value={data.Manufacturer}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    // autoComplete="fname"
                    name="BMC_IP"
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //size="small"
                    id="BMC_IP"
                    label="BMC IP"
                    fullWidth
                    // autoFocus
                    type="text"
                    // value={data.BMC_IP}
                    onChange={(e) => handle(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="BMC_User"
                    label="BMC User"
                    name="BMC_User"
                    fullWidth
                    // autoFocus
                    type="text"
                    // value={data.BMC_User}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="BMC_Password"
                    label="BMC Password"
                    name="BMC_Password"
                    fullWidth
                    // autoFocus
                    type="password"
                    // type="text"
                    // value={data.BMC_Password}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="Asset_Location"
                    label="Asset Location"
                    name="Asset_Location"
                    // autoFocus
                    fullWidth
                    type="text"
                    // value={data.Asset_Location}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="OS_IP"
                    label="OS IP"
                    name="OS_IP"
                    // autoFocus
                    fullWidth
                    type="text"
                    // value={data.OS_IP}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="OS_User"
                    label="OS User"
                    name="OS_User"
                    fullWidth
                    // autoFocus
                    type="text"
                    // value={data.OS_User}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="OS_Password"
                    label="OS Password"
                    name="OS_Password"
                    // autoFocus
                    fullWidth
                    type="password"
                    // value={data.OS_Password}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="Purpose"
                    label="Purpose"
                    fullWidth
                    name="Purpose"
                    // autoFocus
                    type="text"
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="Cluster_Id"
                    label="Cluster ID"
                    fullWidth
                    name="Cluster_Id"
                    // autoFocus
                    type="text"
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
              </Grid>
              <div className="subcanbtn">
                <Button
                  //   type="submit"
                  // fullWidth
                  type="submit"
                  value="SUBMIT"
                  sx={{ width: "25ch" }}
                  variant="contained"
                  // color="info"
                  className={classes.add}
                >
                  Add
                </Button>
                <Button
                  //   type="submit"
                  // fullWidth
                  sx={{ width: "25ch" }}
                  variant="contained"
                  // color="primary"
                  className={classes.cancel}
                  onClick={handleModel5Close}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
          {/* <Box mt={5}> */}
          {/* <Copyright /> */}
          {/* </Box> */}
        </Container>
        {/* </Box> */}
      </Dialog>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box sx={{ width: "100%", typography: "body2" }}>
          <div>
            <MUIDataTable
              title={"List server Request"}
              data={usersData}
              columns={columns}
              options={options}
            />

            {/* <MaterialTable title={"Users"} columns={columns} data={usersData} /> */}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default ListRequest;
