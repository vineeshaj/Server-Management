import MUIDataTable from "mui-datatables";
import * as React from "react";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
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
// import image from "../../Header/Navtabs/adduser.png";
// import image from "../../../img/adduser.png";
// import image from "../../../img/user.png";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import image from "../../../img/adduser1.png";
import image from "../../../img/adduser2.jpg";
//--------------/Add user------------------

//--------------Add user pop-up --------------
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MaterialTable from "material-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import api from "../../../utils/api";
import useAuth from "../../auth";
import swal from "sweetalert";
import "../../../css/users.css";


const UserComponent = () => {
  // checking user role.
  const user = useAuth();
  const classes = useStyles();
  let columns;
  if (user.Role === "infra_admin") {
    columns = [
      {
        name: "Sl no",
        label: "SL.NO",
        options: {
          filter: false,
          sort: true,
        download: false,
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
        name: "User_Id",
        label: "User ID",
        options: {
          filter: true,
          sort: true,
        display: false,

        },
      },
      {
        name: "Email_Id",
        label: "EMAIL ID",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "First_Name",
        label: "FIRST NAME",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "Last_Name",
        label: "LAST NAME",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "90px",
              maxHeight: "30px",
              textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Role",
        label: "ROLE",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "Teams",
        label: "TEAMS",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "60px",
              maxHeight: "30px",
              textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Created_on",
        label: "CREATED ON",
        options: {
          customBodyRender: (value, tableMeta, update) => {
            return <span>{value.slice(0,10)}</span>;
          },
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "120px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Created_by",
        label: "CREATED BY",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "120px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Updated_on",
        label: "UPDATED ON",
        options: {
          customBodyRender: (value, tableMeta, update) => {
            return <span>{value.slice(0,10)}</span>;
          },
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "120px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Updated_by",
        label: "UPDATED BY",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "90px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      // {
      //   name: "Delete",
      //   label: "Delete",
      //   options: {
      //     filter: true,
      //     sort: false,
      //   },
      // },
    ];
  } else {
    columns = [
      {
        name: "Sl no",
        label: "Sl.No",
        options: {
          filter: false,
          sort: true,
        download: false,
        display: true,
          customBodyRender: (value, tableMeta, update) => {
            let rowIndex = (tableMeta.rowIndex) + 1;
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
        name: "User_Id",
        label: "User ID",
        options: {
          filter: true,
          sort: true,
        display: false,

        },
      },
      {
        name: "Email_Id",
        label: "EMAIL ID",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "First_Name",
        label: "FIRST NAME",
        options: {
          filter: true,
          sort: false,
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
        name: "Last_Name",
        label: "LAST NAME",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "90px",
              maxHeight: "30px",
              textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Role",
        label: "ROLE",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "Teams",
        label: "TEAMS",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "60px",
              maxHeight: "30px",
              textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Created_on",
        label: "CREATED ON",
        options: {
          customBodyRender: (value, tableMeta, update) => {
            return <span>{value.slice(0,10)}</span>;
          },
          setCellProps: () => ({
            style: {
              minWidth: "120px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
          filter: true,
          sort: false,
        },
      },
      {
        name: "Created_by",
        label: "CREATED BY",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "120px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      {
        name: "Updated_on",
        label: "UPDATED ON",
        options: {
          customBodyRender: (value, tableMeta, update) => {
            return <span>{value.slice(0,10)}</span>;
          },
          setCellProps: () => ({
            style: {
              minWidth: "120px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
          filter: true,
          sort: false,
        },
      },
      {
        name: "Updated_by",        
        label: "UPDATED BY",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              minWidth: "90px",
              maxHeight: "30px",
              // textAlign: "center",
              // maxWidth: "150px",
            },
          }),
        },
      },
      // {
      //   name: "Delete",
      //   label: "Delete",
      //   options: {
      //     filter: true,
      //     sort: false,
      //   },
      // },
      {
        name: "Edit",
        label: "EDIT",
        options: {
        download: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Button
                onClick={() => editableUsersData(tableMeta.rowData)}
                startIcon={<EditIcon />}
                color="primary"
              ></Button>
            );
          },
        },
      },
      {
        name: "Delete",
        label: "DELETE",
        options: {
        download: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Button
                onClick={() => deleteUserApiFn(tableMeta.rowData[1])}
                // onClick={() => console.log(tableMeta, "tableMeta")}
                startIcon={<DeleteIcon />}
                color="primary"
              ></Button>
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
  }

  const [userRole, setUserRole] = useState("");
  // editable data
  const [User_Id, setUser_Id] = useState();
  const [Email_Id, setEmail_Id] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  //   const [Created_by, setCreated_by] = useState("");
  const [Updated_by, setUpdated_by] = useState("");
  const [Role, setRole] = useState("");
  const [Teams, setTeams] = useState("");

  const editableUsersData = (rowDataArr) => {
    handleEditUserOpen();
    console.log(rowDataArr, "rowDataArr");
    if (rowDataArr !== [] || rowDataArr !== null) {
      setUser_Id(rowDataArr[1]);
      // setEmail_Id(rowDataArr[2]);
      setFirst_Name(rowDataArr[3]);
      setLast_Name(rowDataArr[4]);
      //   setCreated_by(rowDataArr[6]);
      setUpdated_by(user.Username);
      setRole(rowDataArr[5]);
      setTeams(rowDataArr[6]);
    }
  };

  const [usersData, setUsersData] = React.useState([]);
  const [updatedUsers, setUpdatedUsers] = React.useState([]);
  // const [user, setUser] = React.useState([]);
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

  const fullServersideData = ["EMAIL ID"];
  const options = {
    filterType: "checkbox",
    selectableRows: false,
    // selectableRows:'multiple',
    print: false,
    // filter: false,
    viewColumns: false,
    rowsPerPage: [5],
    rowsPerPageOptions: [3, 5, 10, 15],
    responsive: "standard",
    downloadOptions:{
      filename: "user_document.csv",
      filterOptions:{
        useDisplayedColumnsOnly: true
      },
      // customCSVdata: Role,
    },
    // onRowClick: handleRowClick,
  };

  // validation of form
  const validationSchema = Yup.object().shape({
    First_Name: Yup.string().required('Firstname is required'),
    Last_Name: Yup.string().required('Lastname is required'),
    Role: Yup.string().required('Role is required'),
    Teams: Yup.string().required('Teams is required'),
    Email_Id: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    Password: Yup.string()
      .required('Password is required'),
      // .min(6, 'Password must be at least 6 characters')
      // .max(40, 'Password must not exceed 40 characters'),
    // acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const resetFn = () => {
    reset();
    setUserRole("")
  }
  const onSubmitFn = async(data) => {
    console.log(JSON.stringify(data, null, 2));
    console.log(data);
    let postData = {
      Email_Id: data.Email_Id,
      Password: data.Password,
      First_Name: data.First_Name,
      Last_Name: data.Last_Name,
      Created_by: user.Username,
      Role: data.Role,
      Teams: data.Teams,
    };
    console.log(postData, "valid data")
    await api.post("create_user", postData).then(
      (res) => {
        if (res.status === 200) {
          // console.log(res.data);
          //   reset();
          // alert(res.data.Message);
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
          setOpen(false);
          // console.log("created");
          getUsersApi();
          reset();
    setUserRole("");
          // alert("We got your information. We will call you back soon.");
        } else if (res.status === 202) {
          // console.log(res.data, "202");
          // alert(res.data.message);
          swal(res.data.Message)
        } else {
          alert("Something went wrong...Server Error!!");
        }
      }
      // (error) => {
      //   // console.log(error);
      //   // console.log(error.message);
      //   // alert(error.message);
      //   swal(error.message, {
      //     // buttons: false,
      //     timer: 3000,
      //   });
      //   // alert("Refused Connection...Try again later", error);
      // }
    ).catch(function (error) {
      // console.log(error.response.status) // 401
      // console.log(error.response.data) //Please Authenticate or whatever returned from server
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

  const [date, setDate] = useState();
  const [emailData, setEmailData] = useState("");
  const [data, setData] = useState({
    User_Id: "",
    // Email_Id: emailData,
    Password: "",
    First_Name: "",
    Last_Name: "",
    // Created_on: "",
    Created_by: user.Username,
    Role: "",
    Teams: "",
  });

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    // console.log(newdata);
    // console.log(userRole);
  }

  const [isValid, setIsValid] = useState(false);
  // const [message, setMessage] = useState('');
  const emailRegex = /\S+@\S+\.\S+/;

  let helper;
  let error;
  const validateEmail = (event) => {
    const email = event.target.value;
    if (emailRegex.test(email)) {
      console.log(email, "valid fn");
      setIsValid(true);
      setEmailData(email);
      // setMessage('Your email looks good!');
    } else {
      console.log(email,"valid fn false");
      setIsValid(false);
      setEmailData(email);
      helper = !isValid ? "Invalid Email" : "";
      error = !isValid;
      // setMessage('Please enter a valid email!');
    }
  };

  //   const url = "http://3.110.222.142:5002/create_role";
  //   const url = "http://localhost:5002/create_user";
  const createUser = async (e) => {
    e.preventDefault();
    // let dateTime = new Date(date).toISOString();
    if(isValid){
      console.log(emailData,"valid")
    let postData = {
      // User_Id: parseInt(data.User_Id),
      // Email_Id: data.Email_Id,
      Email_Id: emailData,
      Password: data.Password,
      First_Name: data.First_Name,
      Last_Name: data.Last_Name,
      // Created_on: createdDate,
      //   Created_on: dateTime,
      Created_by: data.Created_by,
      Role: userRole,
      Teams: data.Teams,
    };
    console.log(postData, "postData");

    // axios.post(url, postData).then(
    await api.post("create_user", postData).then(
      (res) => {
        if (res.status === 200) {
          // console.log(res.data);
          //   reset();
          // alert(res.data.Message);
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
          setOpen(false);
          // console.log("created");
          getUsersApi();
          // alert("We got your information. We will call you back soon.");
        } else if (res.status === 202) {
          // console.log(res.data, "202");
          // alert(res.data.message);
          swal(res.data.Message)
        } else {
          alert("Something went wrong...Server Error!!");
        }
      },
      (error) => {
        // console.log(error);
        // console.log(error.message);
        // alert(error.message);
        swal(error.message, {
          // buttons: false,
          timer: 3000,
        });
        // alert("Refused Connection...Try again later", error);
      }
    );
    }else{
      console.log(emailData,"invalid")
      console.log("Invalid email..")
    }
  };
  // editing asset api call
  // const editUserUrl = "http://3.110.222.142:5002/update_asset_details";
  //   const editUserUrl = "http://localhost:5002/update_users";
  const submitEditedUserFn = async (e) => {
    e.preventDefault();
    console.log("edited data");
    let postData = {
      User_Id: parseInt(User_Id),
      // Email_Id: Email_Id,
      First_Name: First_Name,
      Last_Name: Last_Name,
      Updated_by: Updated_by,
      Role: Role,
      Teams: Teams,
    };
    console.log(postData, "postData of update user");
    let jsonAssign = JSON.stringify(postData);
    console.log(jsonAssign, "jsonAssign update");

    // axios.put(editUserUrl, jsonAssign).then(
    await api.post("update_users", postData).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          //   reset();
          // alert(res.data.Data);
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
          setEditUserOpen(false);
          getUsersApi();
        } else if(res.status === 202) {
          // alert(res.data.Message);
          swal(res.data.Message, {
            // buttons: false,
            timer: 3000,
          });
          // console.log(res.data.Message);
        } else {
          alert("Something went wrong...Server Error!!");
        }
      }
      // (error) => {
      //   // console.log(error);
      //   // alert("Refused Connection...Try again later", error);
      //   swal(error.message, {
      //     // buttons: false,
      //     timer: 3000,
      //   });
      // }
    ).catch(function (error) {
      // console.log(error.response.status) // 401
      // console.log(error.response.data) //Please Authenticate or whatever returned from server
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

  //delete asset api call
  const deleteUserApiFn = async (UserId) => {
    // if (window.confirm("Are you sure do you want to delete this user ? ")) {
    //   // console.log("deleteUserApiFn", UserId);
    //   let postData = {
    //     User_Id: parseInt(UserId),
    //   };
    //   // console.log(postData, "postData of deleting user");
    //   // let jsonAssign = JSON.stringify(postData);
    //   // console.log(jsonAssign, "jsonAssign");

    //   // axios.post(releaseAssetUrl, postData).then(
    //   await api.put("delete_user", postData).then(
    //     (res) => {
    //       if (res.status === 200) {
    //         // console.log(res.data);
    //         // console.log(typeof res);
    //         //   reset();
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           buttons: false,
    //           timer: 3000,
    //         });
    //         // setOpen(false);
    //         getUsersApi();
    //         // reservedAssetApi();
    //       } else if(res.status === 202) {
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           // buttons: false,
    //           timer: 3000,
    //         });
    //         // console.log(res.data.Message, "202 response");
    //         getUsersApi();

    //       }else {
    //         alert("Something went wrong...Server Error!!");
    //       }
    //     },
    //     (error) => {
    //       // console.log(error);
    //       swal(error.message, {
    //         // buttons: false,
    //         timer: 3000,
    //       });
    //       alert("Refused Connection...Try again later", error);
    //     }
    //   );
    // }

    swal({
      // title: "Are you sure you want to delete the user ?  ",
      text: "Are you sure you want to delete the user ? \n Once deleted, you will not be able to recover deleted user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (data) => {
      if(data) {
        let isuserid = parseInt(user.User_Id)
        if(isuserid !== UserId){
        let postData = {
          User_Id: parseInt(UserId),
        };
        // console.log(postData, "postData of deleting user");
        // let jsonAssign = JSON.stringify(postData);
        // console.log(jsonAssign, "jsonAssign");
  
        // axios.post(releaseAssetUrl, postData).then(
        await api.post("delete_user", postData).then(
          (res) => {
            if (res.status === 200) {
              // console.log(res.data);
              // console.log(typeof res);
              //   reset();
              // alert(res.data.Message);
              swal(res.data.Message, {
                buttons: false,
                timer: 3000,
              });
              // setOpen(false);
              getUsersApi();
              // reservedAssetApi();
            } else if(res.status === 202) {
              // alert(res.data.Message);
              swal(res.data.Message, {
                buttons: false,
                timer: 3000,
              });
              // console.log(res.data.Message, "202 response");
              getUsersApi();
  
            }else {
              alert("Something went wrong...Server Error!!");
            }
          }
          // (error) => {
          //   // console.log(error);
          //   swal(error.message, {
          //     // buttons: false,
          //     timer: 3000,
          //   });
          //   alert("Refused Connection...Try again later", error);
          // }
        ).catch(function (error) {
          // console.log(error.response.status) // 401
          // console.log(error.response.data) //Please Authenticate or whatever returned from server
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
        }else{
          swal("LoggedIn user can't be deleted !!")
        }
      }else {

      }
    })
  };

  //   const getUsersUrl = "http://127.0.0.1:5002/list_users";
  //   const getUsersUrl = "http://3.110.222.142:5002/view_users";
  // const getUsersUrl = "http://localhost:5002/view_users";
  const getUsersApi = async () => {
    // const getUsersUrl = await api.get("view_users");
    // setUsersData(getUsersUrl.data.Listusers);
    await api.get("view_users").then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data.Listusers, "getListusers");

          setUsersData(res.data.Listusers);
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
  const [showUserAddBtn, setShowUserAddBtn] = useState(true);
  const userAddBtn = () => {
    if (user.Role === "infra_admin") {
      setShowUserAddBtn(false);
    } else {
      setShowUserAddBtn(true);
    }
  };

  const isEmail = (email) => {
    if(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      return true;
    }else{
      return false;
    }
  }

  useEffect(() => {
    userAddBtn();
    // const getUsersUrl = await api.get("view_users");
    // axios.get(getUsersUrl).then((res) => {
    //   setUsersData(res.data.Listusers);
    // });
    getUsersApi();
  }, []);
  return (
    <>
        {showUserAddBtn && (
          <div  className="addUserBtn">
            <Button
              variant="standard"
              className="addUserBtnStyle"
              id="addUserBtnStyleId"
              // className={classes.addUserBtn}
              // className="addServerBtn"
              onClick={handleOpen}
              startIcon={<DnsIcon />}
              // color="primary"
            >
            Add User
            </Button>
            {/* </Stack> */}
            <Dialog open={open} className={classes.dialog}>
              {/* <Box className={classes.dialogPaper}> */}
              <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <div className={classes.paper}>
                  {/* <h4 className={classes.addUserFormHeading}>Add User</h4> */}
                  <div className="adduserheaderline">
                  <Box m={0}>
                  <Typography component="h1" variant="h6" className="addasseth6" >
                  Add User
                  </Typography>
                  <Typography component="h1" variant="body2" >
                    All fields are mandatory(*). Please fill all the fields before submitting the form.
                  </Typography>
                  </Box>
                  </div>
                  <form
                    className={classes.form}
                    // onSubmit={(e) => createUser(e)}
                  >
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="standard"
                          required
                          //size="small"
                          id="First_Name"
                          label="First Name"
                          name="First_Name"
                          //focused
                          fullWidth
                          // type="text"
                          // value={data.First_Name}
                          // onChange={(e) => handle(e)}
                          {...register('First_Name')}
                          error={errors.First_Name ? true : false}
                        />
                        <Typography variant="inherit" color="textSecondary">
                          {errors.First_Name?.message}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="Last_Name"
                          variant="standard"
                          required
                          //size="small"
                          id="Last_Name"
                          label="Last Name"
                          //focused
                          fullWidth
                          // type="text"
                          // value={data.Last_Name}
                          // onChange={(e) => handle(e)}
                          {...register('Last_Name')}
                          error={errors.Last_Name ? true : false}
                        />
                        <Typography variant="inherit" color="textSecondary">
                          {errors.Last_Name?.message}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>Role *</InputLabel>
                        <Select
                          id="Role"
                          label="Role"
                          name="Role"
                          variant="standard"
                          placeholder="Role"
                          required
                          //size="small"
                          //focused
                          fullWidth
                          // type="text"
                          // margin="dense"
                          
                          value={userRole}
                          {...register('Role')}
                          error={errors.Role ? true : false} 
                          // helperText={errors.Role==="" || errors.Role===undefined  ? "Role cannot be empty" : ""}
                          // error={errors.Role}
                          onChange={(e) => setUserRole(e.target.value)}
                        >
                          <MenuItem value={"infra_admin"}>Infra Admin</MenuItem>
                          <MenuItem value={"user"}>User</MenuItem>
                        </Select>
                        { userRole==="" && (
                        <div  className="">
                          <Typography variant="inherit" color="textSecondary">
                            Role can't be empty
                          </Typography>
                        </div>
                        )}
                       

                      {/* <InputLabel>
                              Choose one Person of trinity
                          </InputLabel> */}
                          {/* <Controller
                          control={control}
                          name="Role"
                          as={
                            <Select id="Role">
                              <MenuItem value={"infra_admin"}>Infra Admin</MenuItem>
                              <MenuItem value={"user"}>User</MenuItem>
                            </Select>
                          }
                        />
                         <Typography variant="inherit" color="textSecondary">
                        {errors.Role?.message}
                      </Typography> */}
                      </Grid>
                      <Grid item xs={12} sm={6} >
                        <TextField
                          variant="standard"
                          required
                          //size="small"
                          id="Teams"
                          label="Teams"
                          name="Teams"
                          //focused
                          fullWidth
                          // type="text"
                          {...register('Teams')}
                          error={errors.Teams ? true : false} 
                         
                          // value={data.Teams}
                          // onChange={(e) => handle(e)}
                        />
                        <Typography variant="inherit" color="textSecondary">
                          {errors.Teams?.message}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="standard"
                          required
                          //size="small"
                          id="Email_Id"
                          label="Email ID"
                          name="Email_Id"
                          //focused
                          fullWidth
                          // type="text"
                          // value={data.Email_Id}
                          // onChange={(e) => handle(e)}
                          // onChange={(e)=>validateEmail(e)}
                          {...register('Email_Id')}
                          error={errors.Email_Id ? true : false}              
                          //  helperText={!isValid ? "Invalid Email" : ""}
                          //  error={!isValid}
                          // helperText={helper}
                          // error={error}
                        />
                        <Typography variant="inherit" color="textSecondary">
                          {errors.Email_Id?.message}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="standard"
                          required
                          //size="small"
                          id="Password"
                          label="Password"
                          name="Password"
                          //focused
                          fullWidth
                          type="password"
                          // value={data.Password}
                          // onChange={(e) => handle(e)}
                          {...register('Password')}
                          error={errors.Password ? true : false}
                        />
                        <Typography variant="inherit" color="textSecondary">
                          {errors.Password?.message}
                        </Typography>
                      </Grid>
                    </Grid>
                    <div className="usersubcanbtn">
                    <Button
                      //   type="submit"
                      // fullWidth
                      type="submit"
                      value="SUBMIT"
                      sx={{ width: "25ch" }}
                      variant="contained"
                      // color="secondary"
                      id="saveAdd"
                      className={classes.addUserBtn}
                      onClick={handleSubmit(onSubmitFn)}
                    >
                      Add
                    </Button>
                    <Button
                      //   type="submit"
                      // fullWidth
                      sx={{ width: "25ch" }}
                      variant="contained"
                      // color="primary"
                      id="addCancel"
                      className={classes.cancelUserBtn}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    </div>
                  </form>
                </div>
              </Container>
              {/* </Box> */}
            </Dialog>
          </div>
        )}

        {/* user edit form */}
        <Dialog open={editUserOpen} className={classes.dialog}>
          <Box className={classes.dialogPaper}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                {/* <h4 className={classes.addUserFormHeading}>Edit User</h4> */}
                <div className="edituserheaderline">

                <Box m={2}>
                    <Typography component="h1" variant="h6">
                      Edit Asset
                    </Typography>
                    <Typography component="h1" variant="body2" >
                  Please fill mandatory(*) fields.
                </Typography>
                </Box>
                </div>
                <form
                  className={classes.form}
                  onSubmit={(e) => submitEditedUserFn(e)}
                >
                  <Grid container spacing={(0, 0, 0, 4)}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="standard"
                        required
                        //size="small"
                        id="editFirst_Name"
                        label="First Name"
                        name="editFirst_Name"
                        //focused
                        fullWidth
                        type="text"
                        value={First_Name}
                        onChange={(e) => setFirst_Name(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="editLast_Name"
                        variant="standard"
                        required
                        //size="small"
                        id="editLast_Name"
                        label="Last Name"
                        //focused
                        fullWidth
                        type="text"
                        value={Last_Name}
                        onChange={(e) => setLast_Name(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Role *</InputLabel>
                      <Select
                        id="editRole"
                        label="Role"
                        name="editRole"
                        variant="standard"
                        required
                        //size="small"
                        fullWidth
                        //focused
                        type="text"
                        value={Role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <MenuItem value={"infra_admin"}>Infra Admin</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="standard"
                        required
                        //size="small"
                        id="editTeams"
                        label="Teams"
                        fullWidth
                        name="editTeams"
                        //focused
                        type="text"
                        value={Teams}
                        onChange={(e) => setTeams(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <div className="usersubcanbtn">
                  <Button
                    //   type="submit"
                    // fullWidth
                    type="submit"
                    value="SUBMIT"
                    sx={{ width: "25ch" }}
                    variant="contained"
                    // color="secondary"
                    id="editSave"
                    className={classes.addUserBtn}
                  >
                    Save
                  </Button>
                  <Button
                    //   type="submit"
                    // fullWidth
                    sx={{ width: "25ch" }}
                    variant="contained"
                    // color="primary"
                    id="editCancel"
                    className={classes.cancelUserBtn}
                    onClick={handleEditUserClose}
                  >
                    Cancel
                  </Button>
                  </div>
                </form>
              </div>
            </Container>
          </Box>
        </Dialog>

        <Box sx={{ width: "100%", typography: "body2" }}>
          <div>
            <MUIDataTable
              title={"Users"}
              data={usersData}
              columns={columns}
              options={options}
            />

            {/* <MaterialTable title={"Users"} columns={columns} data={usersData} /> */}
          </div>
        </Box>
    </>
  );
};

export default UserComponent;

