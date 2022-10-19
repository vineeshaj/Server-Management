import MUIDataTable from "mui-datatables";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Dialog,
  Grid,
  InputLabel,
  Select,
} from "@material-ui/core";
import DnsIcon from "@mui/icons-material/Dns";
import EditIcon from "@mui/icons-material/Edit";
import { useStyles } from "../../Header/HeaderStyles";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import image from "../../../img/adduser2.jpg";
//--------------/Add user------------------

//--------------Add user pop-up --------------

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MaterialTable from "material-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import api from "../../../utils/api";
import swal from "sweetalert";

const Historic = () => {
  const classes = useStyles();
  const columns = [
    {
      name: "Sl no",
      label: "Sl.No",
      options: {
        filter: false,
        sort: true,
        download: false,
        display: true,
        customBodyRender: (value, tableMeta, update) => {
          let rowIndex = tableMeta.rowIndex + 1;
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
    // {
    //   name: "Asset_ID",
    //   label: "Asset ID",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    {
      name: "Assigned_to",
      label: "Assigned To",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            // minHeight: "42px",
            // textAlign: "center",
          },
        }),
      },
    },
    {
      name: "Assigned_from",
      label: " Assigned From",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            // textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Updated_on",
      label: " Updated On",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            // textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Updated_by",

      label: "Updated By",

      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            // textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },

    {
      name: "Remarks",
      label: "Remarks",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            // textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
  ];

  //----------------------- /Add User-----------------

  const [historyData, setHistoryData] = React.useState([]);
  // const [updatedUsers, setUpdatedUsers] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  //------------------------ Add User Pop-up ---------

  const options = {
    filterType: "checkbox",
    // onRowClick: handleRowClick,
    selectableRows: false,
    print: false,
    // filter: false,
    viewColumns: false,
    rowsPerPage: [5],
    rowsPerPageOptions: [3, 5, 10, 15],
    responsive: "standard",
    downloadOptions: {
      filename: "historic_document.csv",
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

  // const [date, setDate] = useState();
  // const [data, setData] = useState({
  //   User_ID: "",
  //   Email_ID: "",
  //   Password: "",
  //   First_name: "",
  //   Last_name: "",
  //   // Created_on: "",
  //   Created_by: "Infra_Admin",
  //   // Role: "",
  //   Teams: "",
  // });

  // function handle(e) {
  //   const newdata = { ...data };
  //   newdata[e.target.id] = e.target.value;
  //   setData(newdata);
  //   console.log(newdata);
  //   // console.log(userRole);
  // }

  //   const url = "http://3.110.222.142:5002/create_role";
  // const url = "http://localhost:5002/create_user";
  // function createUser(e) {
  //   e.preventDefault();
  //   // let dateTime = new Date(date).toISOString();

  //   let postData = {
  //     User_ID: parseInt(data.User_ID),
  //     Email_ID: data.Email_ID,
  //     Password: data.Password,
  //     First_name: data.First_name,
  //     Last_name: data.Last_name,
  //     // Created_on: createdDate,
  //     //   Created_on: dateTime,
  //     Created_by: data.Created_by,
  //     Role: userRole,
  //     Teams: data.Teams,
  //   };
  //   console.log(postData, "postData");

  //   axios.post(url, postData).then(
  //     (res) => {
  //       if (res.status === 200) {
  //         console.log(res.data);
  //         //   reset();
  //         alert(res.data.message);
  //         // alert("We got your information. We will call you back soon.");
  //       } else if (res.status === 400) {
  //         console.log(res.data, "400");
  //         alert(res.data.message);
  //       } else {
  //         alert("Something went wrong...Server Error!!");
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       console.log(error.message);
  //       alert(error.message);
  //       // alert("Refused Connection...Try again later", error);
  //     }
  //   );
  // }

  // editing asset api call
  // const editUserUrl = "http://3.110.222.142:5002/update_asset_details";
  // const editUserUrl = "http://localhost:5002/update_users";
  // function submitEditedUserFn(e) {
  //   e.preventDefault();
  //   console.log("edited data");
  //   let postData = {
  //     User_ID: parseInt(User_ID),
  //     Email_ID: Email_ID,
  //     First_Name: First_Name,
  //     Last_Name: Last_Name,
  //     Updated_by: Updated_by,
  //     Role: Role,
  //     Teams: Teams,
  //   };
  //   console.log(postData, "postData of update user");
  //   let jsonAssign = JSON.stringify(postData);
  //   console.log(jsonAssign, "jsonAssign update");

  //   axios.put(editUserUrl, jsonAssign).then(
  //     (res) => {
  //       if (res.status === 200) {
  //         console.log(res);
  //         //   reset();
  //         alert(res.data.Data);
  //         handleEditUserClose();
  //       } else {
  //         alert("Something went wrong...Server Error!!");
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       alert("Refused Connection...Try again later", error);
  //     }
  //   );
  // }

  //   const getUsersUrl = "http://127.0.0.1:5002/list_users";
  //   const getUsersUrl = "http://3.110.222.142:5002/view_users";http://localhost:5002/historic_details
  // const getUsersUrl = "http://localhost:5002/historic_details";
  // useEffect(() => {
  //   axios.get(getUsersUrl).then((res) => {
  //     setHistoryData(res.data.Historic_Details);
  //     console.log(res);
  //   });
  // }, []);
  useEffect(() => {
    getHistory();
  }, []);
  const getHistory = async () => {
    // const url = "http://localhost:5002/historic_details";
    // const response = await fetch(url);
    // const datapoint = await response.json();
    // setHistoryData(datapoint.Historic_Details);
    // console.log("mm", datapoint);
    await api.get("historic_details").then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data.Historic_Details, "getHistoric_Details");

          setHistoryData(res.data.Historic_Details);
        } else if (res.status === 202) {
          swal(res.data.Message)
        } else {
          alert("Something went wrong...Server Error!!");
        }
      }
    ).catch(function (error) {
    if(error.response.status===401){
      console.log(error.response.data.Message) //Please Authenticate or whatever returned from server
      swal(error.response.data.Message, {
          icon: "warning",
          buttons: false,
          timer: 3000,
        });
      //redirect to login
    }else if(error.response.status===400) {
      console.log(error) //Please Authenticate or whatever returned from server
      swal(error.response.data.Message, {
          icon: "warning",
          buttons: false,
          timer: 3000,
        });
    }else{
      console.log(error.response.data.Message) //Please Authenticate or whatever returned from server
      swal(error.response.data.Message, {
          icon: "warning",
          buttons: false,
          timer: 3000,
        });
    }
  })
  };
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box sx={{ width: "100%", typography: "body2" }}>
          <div>
            <MUIDataTable
              title={"History Table"}
              data={historyData}
              columns={columns}
              options={options}
            />

            {/* <MaterialTable title={"Users"} columns={columns} data={historyData} /> */}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Historic;
