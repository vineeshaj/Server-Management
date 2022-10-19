import React from "react";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../BodyStyles";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded";
// import Swal from "sweetalert2/dist/sweetalert2.js";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import image from "../../../img/adduser1.png";
import image from "../../../img/adduser2.jpg";
//--------------/Add user------------------
import swal from "sweetalert";

//--------------Add user pop-up --------------

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MaterialTable from "material-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, DatePicker, LocalizationProvider } from "@mui/lab";
import { id } from "date-fns/locale";
import api from "../../../utils/api";
import useAuth from "../../auth";
export const ListRequestforuser = () => {
  const navigate = useNavigate();

  const classes = useStyles();
  const [openModel4, setOpenModel4] = React.useState(false);
  const [openModel3, setOpenModel3] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [uservalue, setUservalue] = React.useState({});

  const handleModel4Open = (s) => {
    setOpenModel4(true);
    console.log(s, "Required Value");
  };
  const handleModel4Close = () => {
    setOpenModel4(false);
  };
  const handleModel3Close = () => {
    setOpenModel3(false);
  };
  const handleModel3Open = (s) => {
    setOpenModel3(true);
    setUservalue(s);
  };
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const infcmt = (s) => {
    // handleModel3Open();
    // submitcomment(e);
    handleModel4Open(s);
  };
  const platformFn = (s) => {
    // usercomment();
    handleModel3Open(s);
    console.log(s, "row server id");
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
      label: " Operating System",
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
      label: "CPU Sockets",
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
      label: "DIMM Capacity ",
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
      name: "Infraadmin_Comments",
      label: "Infra Admin Comments",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              //   className="ppBtnClass"
              onChange={() => console.log(value, tableMeta.rowData[0])}
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
      name: "Edit",
      label: "Edit",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              onClick={() => editableData(tableMeta.rowData)}
              // onClick={() => console.log(tableMeta.rowData, "tableMeta")}
              startIcon={<EditIcon />}
              color="primary"
            ></Button>
          );
        },
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
    {
      name: "User_Comments",
      label: "User Comments",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              //   className="ppBtnClass"
              onChange={() => console.log(value, tableMeta.rowData[0])}
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
      name: "Infraadmin_Comments",
      label: "Infraadmin_Comments",
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
  ];
  const user = useAuth();
  const [output, setOutput] = useState([]);
  useEffect(() => {
    myRequest();
  }, []);
  const myRequest = async () => {
    const user = localStorage.getItem("loggedInUserDetails");
    let loggedPerson = JSON.parse(user);

    if (user.Role === "user") {
      const user = localStorage.getItem("loggedInUserDetails");
      // let loggedPerson = JSON.parse(user);
      // console.log("first", loggedPerson.User_Id);
    }
    let a = {
      User_No: parseInt(loggedPerson.User_Id),

      // User_No: 7,
    };

    await api
      .post("my_request", a)
      .then((res) => {
        //   console.log("data", res.data.ListMyRequests);

        // });
        // console.log("data is comming ", output);
        if (res.status === 200) {
          // console.log(res.data);
          //   reset();
          setOutput(res.data.ListMyRequests);
          // alert(res.data.Message);
          // console.log("verify", res.data);
          // setData(res.data);
          // alert(" Sever requested succesfully ");
          // render("/listrequest");
          // navigate("/listrequestuser");
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
          // setOpen(false);
          // reservedAssetApi();
          // setValue("2");

          // poolAssetApi();

          // handleClose();

          // alert("We got your information. We will call you back soon.");
        } else if (res.status === 202) {
          // alert(res.data.Message);
          // swal(res.data.Message);
          console.log("urgent ", res.config.data);
          // console.log(res.data.Message);
        } else {
          alert("Something went wrong...Server Error!!");
        }
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
  };

  const [User_Comments, setUser_Comments] = useState(" ");

  function submitcomment(e) {
    e.preventDefault();
    let a = {
      User_Comments: User_Comments,
    };
    console.log("loged user list ", a);
    // console.log(a, "a");
    api
      .post("update_u_comments", a)
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

  //-------editable ------

  // const [Assigned_to, setAssigned_to] = useState();
  // const [Asset_Name, setAsset_Name] = useState("");
  // const [Asset_Id, setAsset_Id] = useState();
  // const [Manufacturer, setManufacturer] = useState("");
  // const [BMC_IP, setBMC_IP] = useState("");
  // const [BMC_User, setBMC_User] = useState("");
  // const [Asset_Location, setAsset_location] = useState("");
  // const [OS_IP, setOS_IP] = useState("");
  // const [OS_User, setOS_User] = useState();
  // const [Purpose, setPurpose] = useState("");
  const [Creator, setCreator] = useState("");
  const [Manufacturer, setManufacturer] = useState("");
  const [Start_Date, setStart_Date] = useState("");

  const [Infraadmin_Comments, setInfraadmin_Comments] = useState("");
  // const [User_Comments, setUser_Comments] = useState("");

  const [Number_Of_Servers, setNumber_Of_Servers] = useState("");
  const [Operating_System, setOperating_System] = useState("");
  const [Id, setId] = useState("");
  const [Cpu_model, setCpu_model] = useState("");
  const [CPU_Sockets, setCPU_Sockets] = useState("");
  const [DIMM_Size, setDIMM_Size] = useState("");
  const [DIMM_Capacity, setDIMM_Capacity] = useState("");
  const [Storage_Vendor, setStorage_Vendor] = useState("");
  const [Storage_Controller, setStorage_Controller] = useState("");
  const [Storage_Capacity, setStorage_Capacity] = useState("");

  const [Network_Type, setNetwork_Type] = useState(false);
  const [Network_speed, setNetwork_speed] = useState("");
  const [Number_OF_Network_ports, setNumber_OF_Network_ports] = useState("");
  const [Special_Switching_Needs, setSpecial_Switching_Needs] = useState("");

  //////-----eit auto complete option----
  const Cpu_model1 = [
    { label: "Neples" },
    { label: "Rome" },
    { label: "Milan" },
    { label: "Genova" },
    { label: "Milan X" },
    { label: "Burgamo " },
  ];
  const CPU_Sockets1 = [{ label: "1" }, { label: "2" }, { label: "3" }];
  const Storage_Vendor1 = [
    { label: "Samsung" },
    { label: "Seagate" },
    { label: "Western Digital" },
  ];
  const Storage_Controller1 = [
    { label: "SATA" },
    { label: "SAS" },
    { label: "Nvme" },
    { label: "Mixed" },
  ];

  const Number_Of_Network_Ports1 = [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
  ];
  const Network_speed1 = [
    { label: "1 Gb " },
    { label: "10 Gb" },
    { label: "25 Gb" },
    { label: "100 Gb" },
  ];
  const network_Type1 = [
    { label: "public ", value: true },
    { label: "Private", value: false },
  ];
  const editableData = (rowDataArr) => {
    handleEditOpen();
    console.log("rowDataArr  need", rowDataArr);
    if (rowDataArr !== [] || rowDataArr !== null) {
      // setAsset_Id(rowDataArr[2]);
      // // setAsset_Name(rowDataArr[3]);
      // // setManufacturer(rowDataArr[4]);
      // // setBMC_IP(rowDataArr[6]);
      // // setBMC_User(rowDataArr[7]);
      // setAsset_location(rowDataArr[5]);
      // // setAssigned_to(parseInt(rowDataArr[16]));
      // // setOS_IP(rowDataArr[8]);
      // // setOS_User(rowDataArr[9]);
      // setPurpose(rowDataArr[10]);
      setId(rowDataArr[0]);
      setCreator(rowDataArr[2]);
      setInfraadmin_Comments(rowDataArr[19]);
      setManufacturer(rowDataArr[5]);
      setStart_Date(rowDataArr[3]);
      setNumber_Of_Servers(rowDataArr[6]);
      setOperating_System(rowDataArr[7]);
      setCpu_model(rowDataArr[8]);
      setCPU_Sockets(rowDataArr[9]);
      setDIMM_Size(rowDataArr[10]);
      setDIMM_Capacity(rowDataArr[11]);
      setStorage_Vendor(rowDataArr[12]);
      setStorage_Controller(rowDataArr[13]);
      setStorage_Capacity(rowDataArr[14]);
      setNumber_OF_Network_ports(rowDataArr[15]);
      setNetwork_speed(rowDataArr[16]);

      setNetwork_Type(rowDataArr[17]);

      setSpecial_Switching_Needs(rowDataArr[18]);
    }
  };
  useEffect(() => {
    submitEditedFn();
  }, []);
  //----- onsubmit edit funtion-----
  const submitEditedFn = async (e) => {
    e.preventDefault();
    console.log("edited data");
    if (Boolean(Network_Type)) {
      console.log("Network_Type", Network_Type);
    }
    let postData = {
      // Asset_Id: Asset_Id,
      // Asset_Name: Asset_Name,
      // Assigned_to: parseInt(Assigned_to),
      // Manufacturer: Manufacturer,
      // BMC_IP: BMC_IP,
      // BMC_User: BMC_User,
      // Asset_Location: Asset_Location,
      // OS_IP: OS_IP,
      // OS_User: parseInt(OS_User),
      // Purpose: Purpose,
      // Updated_by: user.Username,
      // Status: true,
      //check

      Id: Id,
      User_No: parseInt(user.User_Id),
      Request: false,
      Infraadmin_Comments: Infraadmin_Comments,
      User_Comments: User_Comments,
      Start_Date: Start_Date,
      Creator: Creator,
      Manufacturer: Manufacturer,
      Number_Of_Servers: Number_Of_Servers,
      Operating_System: Operating_System,
      Cpu_model: Cpu_model,
      CPU_Sockets: CPU_Sockets,
      DIMM_Size: DIMM_Size,
      DIMM_Capacity: DIMM_Capacity,
      Storage_Vendor: Storage_Vendor,
      Storage_Controller: Storage_Controller,
      Storage_Capacity: Storage_Capacity,
      Network_Type: Boolean(Network_Type),
      Network_speed: Network_speed,
      Number_OF_Network_ports: Number_OF_Network_ports,
      Special_Switching_Needs: Special_Switching_Needs,
    };
    console.log(postData, "postData of update asset");
    let jsonAssign = JSON.stringify(postData);
    console.log(jsonAssign, "jsonAssign update");
    // console.log(a, "a");
    api
      .post("update_u_comments", postData)
      .then((res) => {
        //     console.log("res req now", res);
        //     console.log("post data", postData);
        //     // setOutput(res.data);
        //     // toast.success("add susses");
        //     // alert("message added");

        //
        //     // history.push('/login')
        //   })
        //   .catch((err) => {
        //     console.log(err);

        //     alert("error added");
        //   });
        // // handleModel4Close();
        // // if (!post) return "No post!";
        if (res.status === 200) {
          // console.log(res.data);
          //   reset();
          // setOutput(res.data.ListMyRequests);
          // alert(res.data.Message);
          // console.log("verify", res.data);
          // setData(res.data);
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
          handleEditClose();

          // alert(" Sever requested succesfully ");
          // render("/listrequest");
          navigate("/listrequestuser");
          // swal(res.data.Message, {
          //   buttons: false,
          //   timer: 3000,
          // });
          // setOpen(false);
          // reservedAssetApi();
          // setValue("2");

          // poolAssetApi();

          // handleClose();

          // alert("We got your information. We will call you back soon.");
        } else if (res.status === 202) {
          // alert(res.data.Message);
          // swal(res.data.Message);
          console.log("urgent ", res.config.data);
          // console.log(res.data.Message);
        } else {
          alert("Something went wrong...Server Error!!");
        }
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
  };

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
            Infra Admin comments
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
              User Comments
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
                    id="setUser_Comments"
                    label="User Comments"
                    name="setUser_Comments"
                    placeholder="User Comments"
                    focused
                    type="text"
                    // value={Infraadmin_Comments}
                    onChange={(e) => setUser_Comments(e.target.value)}
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
                // color="success"
                className={classes.add}
              >
                Save
              </Button>
              <Button
                // type="submit"
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
      <Dialog open={editOpen} className={classes.dialog}>
        {/* <Box className={classes.dialogPaper}> */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <div className="editassetheaderline">
              <Box m={2}>
                <Typography component="h1" variant="h6">
                  Edit Request
                </Typography>
                <Typography component="h1" variant="body2">
                  Please fill mandatory(*) fields.
                </Typography>
              </Box>
            </div>

            {/* <Button variant="contained" >
                Send
              </Button> */}

            <form className={classes.form} onSubmit={(e) => submitEditedFn(e)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    fullWidth
                    id="Manufacturer"
                    label="Manufacturer"
                    name="Manufacturer"
                    focused
                    type="text"
                    value={Manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    // helperText={Asset_Location === "" ? "Asset Location field cannot be empty" : ""}
                    // error={Asset_Location === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    id="Number_Of_Servers"
                    label="Number Of Servers"
                    name="Number Of Servers"
                    // focused
                    fullWidth
                    type="text"
                    // value={Purpose}
                    value={Number_Of_Servers}
                    onChange={(e) => setNumber_Of_Servers(e.target.value)}
                    // helperText={Purpose === "" ? "Purpose field cannot be empty" : ""}
                    // error={Purpose === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    fullWidth
                    id="Operating_System"
                    label="Operating System"
                    name="Operating_System"
                    // focused
                    type="text"
                    // value={Asset_Location}
                    value={Operating_System}
                    onChange={(e) => setOperating_System(e.target.value)}
                    // helperText={Asset_Location === "" ? "Asset Location field cannot be empty" : ""}
                    // error={Asset_Location === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="Cpu_model"
                    value={Cpu_model}
                    // onChange={(e) => setCpu_model(e.target.value)}
                    onSelect={(e) => setCpu_model(e.target.value)}
                    options={Cpu_model1}
                    // sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField {...params} required label="CPU Model" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="CPU_Sockets"
                    value={CPU_Sockets}
                    // onChange={(e) => setCpu_model(e.target.value)}
                    onSelect={(e) => setCPU_Sockets(e.target.value)}
                    options={CPU_Sockets1}
                    // sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField
                        type={"integer"}
                        required
                        {...params}
                        label="CPU Sockets"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    id="DIMM_Size"
                    label="DIMM Size"
                    name="DIMM_Size"
                    // focused
                    fullWidth
                    type="text"
                    value={DIMM_Size}
                    onChange={(e) => setDIMM_Size(e.target.value)}
                    // helperText={Purpose === "" ? "Purpose field cannot be empty" : ""}
                    // error={Purpose === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    fullWidth
                    id="DIMM_Capacity"
                    label="DIMM Capacity"
                    name="DIMM_Capacity"
                    // focused
                    type="text"
                    value={DIMM_Capacity}
                    onChange={(e) => setDIMM_Capacity(e.target.value)}
                    // helperText={Asset_Location === "" ? "Asset Location field cannot be empty" : ""}
                    // error={Asset_Location === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="Storage_Vendor"
                    value={Storage_Vendor}
                    onSelect={(e) => setStorage_Vendor(e.target.value)}
                    // onSelect={(e) => handlechange(e)}
                    options={Storage_Vendor1}
                    // sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField {...params} required label="Storage Vendor" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="Storage_Controller"
                    value={Storage_Controller}
                    onSelect={(e) => setStorage_Controller(e.target.value)}
                    // onSelect={(e) => handlechange(e)}
                    options={Storage_Controller1}
                    // sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Storage_Controller"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    id="Storage_Capacity"
                    label="Storage_Capacity Of Servers"
                    name="Storage_Capacity"
                    // focused
                    fullWidth
                    type="text"
                    value={Storage_Capacity}
                    onSelect={(e) => setStorage_Capacity(e.target.value)}
                    // helperText={Purpose === "" ? "Purpose field cannot be empty" : ""}
                    // error={Purpose === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttonslabel-group-">
                      Network Type
                    </FormLabel>
                    <RadioGroup
                      value={Network_Type}
                      id="Network_Type"
                      onChange={(e) =>
                        console.log(e.target.value, "main value")
                      }
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value={false}
                        typeof="radio"
                        onClick={(e) => setNetwork_Type(e.target.value)}
                        control={<Radio />}
                        label="Private"
                      />
                      <FormControlLabel
                        value={true}
                        typeof="radio"
                        onClick={(e) => setNetwork_Type(e.target.value)}
                        control={<Radio />}
                        label="Public"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="Network_speed"
                    value={Network_speed}
                    onSelect={(e) => setNetwork_speed(e.target.value)}
                    // onSelect={(e) => handlechange(e)}
                    options={Network_speed1}
                    // sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField {...params} required label="Network speed" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    id="Number_OF_Network_ports"
                    value={Number_OF_Network_ports}
                    // onSelect={(e) => handlechange(e)}
                    onSelect={(e) => setNumber_OF_Network_ports(e.target.value)}
                    options={Number_Of_Network_Ports1}
                    // sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField {...params} required label="Network Ports" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    // required
                    //size="small"
                    id="Special_Switching_Needs"
                    label="Special_Switching_Needs"
                    name="Special Switching Needs"
                    // focused
                    fullWidth
                    type="text"
                    value={Special_Switching_Needs}
                    onChange={(e) => setSpecial_Switching_Needs(e.target.value)}
                    // helperText={Purpose === "" ? "Purpose field cannot be empty" : ""}
                    // error={Purpose === ""}
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
                  // color="success"
                  className={classes.add}
                >
                  Save
                </Button>
                <Button
                  //   type="submit"
                  // fullWidth
                  sx={{ width: "25ch" }}
                  variant="contained"
                  // color="primary"
                  className={classes.cancel}
                  onClick={handleEditClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Container>
        {/* </Box> */}
      </Dialog>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box sx={{ width: "100%", typography: "body2" }}>
          <div>
            <MUIDataTable
              title={"List server Request"}
              data={output}
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
export default ListRequestforuser;
