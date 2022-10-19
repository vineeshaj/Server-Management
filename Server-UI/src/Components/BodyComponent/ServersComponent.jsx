import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import ReactJson from "react-json-view";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import axios from "axios";
import {
  Button,
  Container,
  CssBaseline,
  Dialog,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import DnsIcon from "@mui/icons-material/Dns";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStyles } from "./BodyStyles";
import "../../css/servers.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import api from "../../utils/api";
import {
  createMuiTheme,
  MuiThemeProvider,
  styled,
} from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { minWidth } from "@mui/system";
import useAuth from "../auth";
import swal from "sweetalert";
//--------------/Tabs ---------------------

const UserPickerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// const muiCache = createCache({
//   key: "mui",
//   prepend: true,
// });

const ServersComponent = () => {
  // here I set the them
  // const getMuiTheme = () =>
  //   createTheme({
  //     overrides: {
  //       MUIDataTableSelectCell: {
  //         headerCell: {
  //           backgroundColor: "blue",
  //         },
  //         MUIDataTableBodyCell: {
  //           root: {
  //             backgroundColor: "#FFF",
  //             width: "200px",
  //           },
  //         },
  //       },
  //     },
  //   });
  let userDetailsArr = [];
  // let userObj;

  const columns = [
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
            // display: "flex",
            // minWidth: "80px",
            // maxHeight: "30px",
            minHeight: "42px",
            textAlign: "center",
            // alignItems: "center"
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Release",
      label: "Release",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              className="releaseBtnClass"
              onClick={() => releaseBtnDiv(tableMeta.rowData[2])}
              // onClick={() => console.log(value, tableMeta.rowData[1])}
            >
              Release Server
            </button>
          );
        },
        sort: true,
        download: false,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
        // setCellProps: () => {
        //   return { align: "center" };
        // },
      },
    },
    {
      name: "Asset_Id",
      label: "Asset ID",
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
      name: "Asset_Name",
      label: "Asset Name",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
        // setCellProps: () => {
        //   return { align: "center" };
        // },
      },
    },
    {
      name: "Manufacturer",
      label: "Manufacturer",
      options: {
        filter: true,
        sort: true,
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
      name: "Asset_Location",
      label: "Location",
      options: {
        filter: true,
        setCellProps: () => ({
          style: {
            minWidth: "80px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
        sort: true,
      },
    },
    {
      name: "BMC_IP",
      label: "BMC IP",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "BMC_User",
      label: "BMC User",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "OS_IP",
      label: "OS IP",
      options: {
        filter: true,
        sort: true,
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
      name: "OS_User",
      label: "OS User",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Purpose",
      label: "Purpose",
      options: {
        filter: true,
        sort: true,
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
      name: "Cluster_Id",
      label: "Cluster ID",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "65px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(value);
          if (value === true) {
            return (
              <>
                <div className="activeClass">
                  <span>Active</span>
                </div>
              </>
            );
          } else {
            return (
              <>
                <div className="inactiveClass">
                  <span>Inactive</span>
                </div>
              </>
            );
          }
        },
      },
    },
    {
      name: "Created_on",
      label: "Created On",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Created_by",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Assigned_by",
      label: "Assigned By",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Assigned_to",
      label: "Assigned To",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Assigned_from",
      label: "Assigned From",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Updated_on",
      label: "Updated On",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
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
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Edit",
      label: "Edit",
      options: {
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              onClick={() => editableData(tableMeta.rowData)}
              // onClick={() => console.log(tableMeta, "tableMeta")}
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
      name: "Delete",
      label: "Delete",
      options: {
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              onClick={() => deleteApiFn(tableMeta.rowData[2])}
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
    {
      name: "Platform Profiler",
      label: "Platform Profiler",
      options: {
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              className="ppBtnClass"
              // onChange={() => console.log(value, tableMeta.rowData[0])}
              onClick={() => platformFn(tableMeta.rowData[0])}
            >
              View
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
    // {
    //   name: "Delete",
    //   label: "Delete",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    // {
    //   name: "Status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
  ];

  const poolColumns = [
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
        setCellProps: () => ({
          style: {
            minWidth: "80px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
        // setCellProps: () => {
        //   return { align: "center" };
        // },
      },
    },
    {
      name: "Reserve",
      label: "Reserve",
      options: {
        // customHeadRender: (columnMeta)=>{
        //   download: false,
        //   searchable: false,
        // },
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (user.Role === "user") {
            return (
              <button
                className="reserveBtnClass"
                // onClick={() => console.log(value, tableMeta.rowData[2])}
                onClick={() => userServerAssign(tableMeta.rowData[2])}
              >
                Reserve Server
              </button>
            );
          } else {
            return (
              <button
                className="reserveBtnClass"
                // onChange={() => console.log(value, tableMeta.rowData[0])}
                onClick={() => openModelDiv(tableMeta.rowData[2])}
              >
                Reserve Server
              </button>
            );
          }
        },
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
      name: "Asset_Id",
      label: "Asset ID",
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
      name: "Asset_Name",
      label: "Asset Name",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Manufacturer",
      label: "Manufacturer",
      options: {
        filter: true,
        sort: true,
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
      name: "Asset_Location",
      label: "Location",
      options: {
        filter: true,
        sort: true,
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
      name: "BMC_IP",
      label: "BMC IP",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxHeight: "30px",
            textAlign: "center",
            maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "BMC_User",
      label: "BMC User",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "OS_IP",
      label: "OS IP",
      options: {
        filter: true,
        sort: true,
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
      name: "OS_User",
      label: "OS User",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Purpose",
      label: "Purpose",
      options: {
        filter: true,
        sort: true,
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
      name: "Cluster_Id",
      label: "Cluster ID",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    // {
    //   name: "Reserved",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: "65px",
    //         maxHeight: "30px",
    //         textAlign: "center",
    //         // maxWidth: "150px",
    //       },
    //     }),
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       // console.log(value);
    //       if (value === true) {
    //         return (
    //           <>
    //             <div className="activeClass">
    //               <span>Active</span>
    //             </div>
    //           </>
    //         );
    //       } else {
    //         return (
    //           <>
    //             <div className="inactiveClass">
    //               <span>Inactive</span>
    //             </div>
    //           </>
    //         );
    //       }
    //     },
    //   },
    // },
    {
      name: "Created_on",
      label: "Created On",
      options: {
        customBodyRender: (value, tableMeta, update) => {
          return <span>{value.slice(0, 10)}</span>;
        },
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    {
      name: "Created_by",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            maxHeight: "30px",
            textAlign: "center",
            // maxWidth: "150px",
          },
        }),
      },
    },
    // {
    //   name: "Assigned_by",
    //   label: "Assigned By",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: "140px",
    //         maxHeight: "30px",
    //         textAlign: "center",
    //         // maxWidth: "150px",
    //       },
    //     }),
    //   },
    // },
    // {
    //   name: "Assigned_to",
    //   label: "Assigned To",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: "140px",
    //         maxHeight: "30px",
    //         textAlign: "center",
    //         // maxWidth: "150px",
    //       },
    //     }),
    //   },
    // },
    // {
    //   name: "Assigned_from",
    //   label: "Assigned From",
    //   options: {
    //     customBodyRender: (value, tableMeta, update) => {
    //       return <span>{value.slice(0,10)}</span>;
    //     },
    //     filter: true,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: "140px",
    //         maxHeight: "30px",
    //         textAlign: "center",
    //         // maxWidth: "150px",
    //       },
    //     }),
    //   },
    // },

    // {
    //   name: "Updated_on",
    //   label: "Updated On",
    //   options: {
    //     customBodyRender: (value, tableMeta, update) => {
    //       return <span>{value.slice(0,10)}</span>;
    //     },
    //     filter: true,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: "140px",
    //         maxHeight: "30px",
    //         textAlign: "center",
    //         // maxWidth: "150px",
    //       },
    //     }),
    //   },
    // },
    // {
    //   name: "Updated_by",
    //   label: "Updated By",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: "140px",
    //         maxHeight: "30px",
    //         textAlign: "center",
    //         // maxWidth: "150px",
    //       },
    //     }),
    //   },
    // },

    // {
    //   name: "Delete",
    //   label: "Delete",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    // {
    //   name: "Status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
  ];

  const options = {
    filterType: "checkbox",
    print: false,
    selectableRows: false,
    rowsPerPage: [5],
    rowsPerPageOptions: [3, 5, 10, 15],
    viewColumns: false,
    responsive: "standard",
    downloadOptions: {
      filename: "server_management_document.csv",
      filterOptions: {
        useDisplayedColumnsOnly: true,
      },
    },
    //   onDownload: (buildHead, buildBody, columns, data) => {
    //     return "\uFEFF" + buildHead(columns) + buildBody("Sl no");
    // }
    // onDownload: (buildHead, buildBody, columns, data) => {
    // buildHead=()=>{
    // return ["col-1", "col-2"]

    // }
    // buildBody=()=>{
    //   return [["A", "B"], ["C","D"]]
    // }
    // return "\uFEFF" + buildHead() + buildBody();

    // component.pdfReportAutoTable(
    //   columns,
    //   data
    //   );
    //   return false;
    // return buildHead("SL.NO") + buildBody(data);
    // let desiredColumns = [columns[0].label,columns[1].label,columns[2].label]
    // console.log(buildHead, "columns");
    // console.log(buildBody, "columns");
    // console.log(columns, "columns");
    // console.log(desiredColumns, "desiredColumns");
    // console.log(data, "data");
    // return "\uFEFF" + buildHead(columns) + buildBody(data);

    // }
    // resizableColumns: true,
    // setCellHeaderProps: () => ({ style: { maxHeight: "30px" } }),
    // setCellProps: () => ({ style: { minWidth: "200px" } }),
    // setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "800px" } }),
    // customBodyRender: (data, type, row) => {
    //   return <pre>{data}</pre>;
    // },
    // setCellProps: () => {
    //   return { align: "right" };
    // },
    // setCellHeaderProps: () => ({ align: "center" }),
    // setCellHeaderProps: () => ({
    //   style: {
    //     display: "flex",
    //     justifyContent: "right",
    //     flexDirection: "row-reverse",
    //     borderBottom: "none",
    //   },
    // }),
  };
  const user = useAuth();

  const classes = useStyles();
  const [date, setDate] = useState();
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

  // editable data
  const [Assigned_to, setAssigned_to] = useState();
  const [Asset_Name, setAsset_Name] = useState("");
  const [Asset_Id, setAsset_Id] = useState();
  const [Manufacturer, setManufacturer] = useState("");
  const [BMC_IP, setBMC_IP] = useState("");
  const [BMC_User, setBMC_User] = useState("");
  const [Asset_Location, setAsset_location] = useState("");
  const [OS_IP, setOS_IP] = useState("");
  const [OS_User, setOS_User] = useState();
  const [Purpose, setPurpose] = useState("");

  const editableData = (rowDataArr) => {
    handleEditOpen();
    console.log(rowDataArr, "rowDataArr need");
    if (rowDataArr !== [] || rowDataArr !== null) {
      setAsset_Id(rowDataArr[2]);
      // setAsset_Name(rowDataArr[3]);
      // setManufacturer(rowDataArr[4]);
      // setBMC_IP(rowDataArr[6]);
      // setBMC_User(rowDataArr[7]);
      setAsset_location(rowDataArr[5]);
      // setAssigned_to(parseInt(rowDataArr[16]));
      // setOS_IP(rowDataArr[8]);
      // setOS_User(rowDataArr[9]);
      setPurpose(rowDataArr[10]);
    }
  };

  // adding asset api call
  // const url = "http://localhost:5002/add_server";
  // const url = "http://3.110.222.142:5002/add_asset";
  // const url = "http://localhost:5002/add_asset";
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
    await api.post("add_asset", postData).then(
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
          // reservedAssetApi();
          setValue("2");

          poolAssetApi();

          // handleClose();

          // alert("We got your information. We will call you back soon.");
        } else if (res.status === 202) {
          // alert(res.data.Message);
          swal(res.data.Message);
          // console.log(res.data.Message);
        } else {
          alert("Something went wrong...Server Error!!");
        }
      }
      // (error) => {
      //   // console.log(error);
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

  // reserving asset api call
  // const assignAssetUrl = "http://3.110.222.142:5002/assign_asset";
  // const assignAssetUrl = "http://localhost:5002/assign_asset";
  const assignApiFn = async () => {
    // e.preventDefault();
    // if (window.confirm("Are you sure do you want to assign server ? ")) {
    //   // console.log("assign");
    //   let postData = {
    //     Asset_Id: parseInt(serverId),
    //     Assigned_to: parseInt(userID),
    //     Assigned_by: user.Username,
    //     Updated_by: user.Username,
    //   };
    //   // console.log(postData, "postData of assign asset");
    //   // let jsonAssign = JSON.stringify(postData);
    //   // console.log(jsonAssign, "jsonAssign");

    //   // axios.post(assignAssetUrl, postData).then(
    //   await api.post("assign_asset", postData).then(
    //     (res) => {
    //       if (res.status === 200) {
    //         // console.log(res);
    //         //   reset();
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           buttons: false,
    //           timer: 3000,
    //         });
    //         poolAssetApi();
    //         // reservedAssetApi();
    //         reservedOrMyassetApi();
    //       }else if(res.status === 202) {
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           // buttons: false,
    //           timer: 3000,
    //         });
    //         // console.log(res.data.Message);
    //       }  else {
    //         alert("Something went wrong...Server Error!!");
    //       }
    //     },
    //     (error) => {
    //       // console.log(error);
    //       swal(error.message, {
    //         // buttons: false,
    //         timer: 3000,
    //       });
    //       // alert("Refused Connection...Try again later", error);
    //     }
    //   );
    // }

    swal({
      // title: "Are you sure you want to assign the server ?  ",
      text: "Are you sure you want to assign the server ? ",
      // text: "Are you sure you want to delete the server ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (data) => {
      if (data) {
        let postData = {
          Asset_Id: parseInt(serverId),
          Assigned_to: parseInt(userID),
          Assigned_by: user.Username,
          Updated_by: user.Username,
        };

        console.log(postData, "postData of assign asset");
        // let jsonAssign = JSON.stringify(postData);
        // console.log(jsonAssign, "jsonAssign");

        // axios.post(assignAssetUrl, postData).then(
        await api.post("assign_asset", postData).then(
          (res) => {
            if (res.status === 200) {
              // console.log(res);
              //   reset();
              console.log(res.data, "vineeeee 200");

              // alert(res.data.message);
              swal(res.data.Message, {
                buttons: false,
                timer: 3000,
              });
              poolAssetApi();
              // reservedAssetApi();
              reservedOrMyassetApi();
            } else if (res.status === 202) {
              console.log(res.data, "vineeeee");
              // alert(res.data);
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
      }else {

      }
    });
  };

  const userServerAssignApiFn = async (assetID) => {
    // e.preventDefault();
    // if (window.confirm("Are you sure do you want to assign server ? ")) {
    //   // console.log("assign");
    //   let postData = {
    //     Asset_Id: parseInt(serverId),
    //     Assigned_to: parseInt(userID),
    //     Assigned_by: user.Username,
    //     Updated_by: user.Username,
    //   };
    //   // console.log(postData, "postData of assign asset");
    //   // let jsonAssign = JSON.stringify(postData);
    //   // console.log(jsonAssign, "jsonAssign");

    //   // axios.post(assignAssetUrl, postData).then(
    //   await api.post("assign_asset", postData).then(
    //     (res) => {
    //       if (res.status === 200) {
    //         // console.log(res);
    //         //   reset();
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           buttons: false,
    //           timer: 3000,
    //         });
    //         poolAssetApi();
    //         // reservedAssetApi();
    //         reservedOrMyassetApi();
    //       }else if(res.status === 202) {
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           // buttons: false,
    //           timer: 3000,
    //         });
    //         // console.log(res.data.Message);
    //       }  else {
    //         alert("Something went wrong...Server Error!!");
    //       }
    //     },
    //     (error) => {
    //       // console.log(error);
    //       swal(error.message, {
    //         // buttons: false,
    //         timer: 3000,
    //       });
    //       // alert("Refused Connection...Try again later", error);
    //     }
    //   );
    // }

    swal({
      // title: "Are you sure you want to assign the server ?  ",
      text: "Are you sure you want to assign the server ? ",
      // text: "Are you sure you want to delete the server ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (data) => {
      if(data) {
        // console.log(assetID, "kioik")
           let postData = {
            Asset_Id: parseInt(assetID),
            Assigned_to: parseInt(user.User_Id),
            Assigned_by: user.Username,
            Updated_by: user.Username,
          };
        console.log(postData, "postData of assign asset");
        // let jsonAssign = JSON.stringify(postData);
        // console.log(jsonAssign, "jsonAssign");

        // axios.post(assignAssetUrl, postData).then(
        await api.post("assign_asset", postData).then(
          (res) => {
            if (res.status === 200) {
              // console.log(res);
              //   reset();
              // console.log(res.data, "vineeeee 200")

              // alert(res.data.message);
              swal(res.data.Message, {
                buttons: false,
                timer: 3000,
              });
              poolAssetApi();
              // reservedAssetApi();
              reservedOrMyassetApi();
            }else if(res.status === 202) {
              // console.log(res.data, "vineeeee")
              // alert(res.data);
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
      }else {

      }
    });
  };
  // editing asset api call
  // const editAssetUrl = "http://3.110.222.142:5002/update_asset_details";
  // const editAssetUrl = "http://localhost:5002/update_asset_details";
  const submitEditedFn = async (e) => {
    e.preventDefault();
    console.log("edited data");
    let postData = {
      Asset_Id: Asset_Id,
      // Asset_Name: Asset_Name,
      // Assigned_to: parseInt(Assigned_to),
      // Manufacturer: Manufacturer,
      // BMC_IP: BMC_IP,
      // BMC_User: BMC_User,
      Asset_Location: Asset_Location,
      // OS_IP: OS_IP,
      // OS_User: parseInt(OS_User),
      Purpose: Purpose,
      Updated_by: user.Username,
      // Status: true,
    };
    console.log(postData, "postData of update asset");
    let jsonAssign = JSON.stringify(postData);
    console.log(jsonAssign, "jsonAssign update");

    // axios.post(editAssetUrl, jsonAssign).then(
    await api.post("update_asset_details", postData).then(
      (res) => {
        if (res.status === 200) {
          // console.log(res);
          //   reset();
          // alert(res.data.Message);
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
          // reservedAssetApi();
          reservedOrMyassetApi();
          handleEditClose();
        } else if (res.status === 202) {
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
  //--------------------- Tabs ------------------------
  const [allServersData, setAllServersData] = useState([]);
  const [reservedServersData, setReservedServersData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  //   const [poolServersData, setPoolServersData] = useState([]);
  const [value, setValue] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [openModel2, setOpenModel2] = React.useState(false);
  const [openModel3, setOpenModel3] = React.useState(false);
  const [userID, setUserID] = useState("");
  const [serverId, setServerId] = useState("");
  const [platformInfo, setPlatformInfo] = useState({});
  const [platformId, setPlatformId] = useState("");
  const [platformManufacturer, setPlatformManufacturer] = useState("");
  const [platformIdModel, setPlatformIdModel] = useState("");
  const [platformIdPowerState, setPlatformIdPowerState] = useState("");
  const [platformIdHealth, setPlatformIdHealth] = useState("");
  const [platformSystems, setPlatformSystems] = useState("");

  // Accordian
  const [expanded, setExpanded] = React.useState(false);

  const handleAccordianChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // releasing asset api call
  // const releaseAssetUrl = "http://3.110.222.142:5002/release_asset";
  // const releaseAssetUrl = "http://localhost:5002/release_asset";
  const releaseApiFn = async (serverid) => {
    // console.log("release");
    // console.log(serverid);
    // if (window.confirm("Are you sure do you want to release server ? ")) {
    //   let postData = {
    //     Asset_Id: parseInt(serverid),
    //   };
    //   // console.log(postData, "postData of releasing asset");
    //   // let jsonAssign = JSON.stringify(postData);
    //   // console.log(jsonAssign, "jsonAssign");

    //   // axios.post(releaseAssetUrl, postData).then(
    //   await api.post("release_asset", postData).then(
    //     (res) => {
    //       if (res.status === 200) {
    //         // console.log(res.data);
    //         //   reset();
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           buttons: false,
    //           timer: 3000,
    //         });
    //         // reservedAssetApi();
    //         reservedOrMyassetApi();
    //         poolAssetApi();
    //       } else if(res.status === 202) {
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           // buttons: false,
    //           timer: 3000,
    //         });
    //         // console.log(res.data.Message);
    //       } else {
    //         alert("Something went wrong...Server Error!!");
    //       }
    //     },
    //     (error) => {
    //       // console.log(error);
    //       swal(error.message, {
    //         // buttons: false,
    //         timer: 3000,
    //       });
    //       // alert("Refused Connection...Try again later", error);
    //     }
    //   );
    // }
    swal({
      // title: "Are you sure you want to release the server ?  ",
      // text: "Once deleted, you will not be able to recover deleted asset!",
      text: "Are you sure you want to release the server ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (data) => {
      if (data) {
        let postData = {
          Asset_Id: parseInt(serverid),
        };
        // console.log(postData, "postData of releasing asset");
        // let jsonAssign = JSON.stringify(postData);
        // console.log(jsonAssign, "jsonAssign");

        // axios.post(releaseAssetUrl, postData).then(
        await api.post("release_asset", postData).then(
          (res) => {
            if (res.status === 200) {
              // console.log(res.data);
              //   reset();
              // alert(res.data.Message);
              swal(res.data.Message, {
                buttons: false,
                timer: 3000,
              });
              // reservedAssetApi();
              reservedOrMyassetApi();
              poolAssetApi();
            } else if (res.status === 202) {
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
      }else{

      }
    });
  };

  //delete asset api call
  const deleteApiFn = async (serverid) => {
    // if (window.confirm("Are you sure you want to delete this server ?  ")) {
    //   // console.log("deleteApiFn", serverid);
    //   let postData = {
    //     Asset_Id: parseInt(serverid),
    //   };
    //   // console.log(postData, "postData of deleting asset");
    //   // let jsonAssign = JSON.stringify(postData);
    //   // console.log(jsonAssign, "jsonAssign");

    //   // axios.post(releaseAssetUrl, postData).then(
    //   await api.put("delete_asset", postData).then(
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
    //         // reservedAssetApi();
    //         reservedOrMyassetApi();
    //       } else if(res.status === 202) {
    //         // alert(res.data.Message);
    //         swal(res.data.Message, {
    //           // buttons: false,
    //           timer: 3000,
    //         });
    //         // console.log(res.data.Message);
    //       } else {
    //         alert("Something went wrong...Server Error!!");
    //       }
    //     },
    //     (error) => {
    //       // console.log(error);
    //       swal(error.message, {
    //         // buttons: false,
    //         timer: 3000,
    //       });
    //       // alert("Refused Connection...Try again later", error);
    //     }
    //   );
    // }

    swal({
      // title: "Are you sure you want to delete the server ?  ",
      text: "Are you sure you want to delete the server ? \n Once deleted, you will not be able to recover deleted server!",
      // text: "Are you sure you want to delete the server ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (data) => {
      if (data) {
        let postData = {
          Asset_Id: parseInt(serverid),
        };
        // console.log(postData, "postData of deleting asset");
        // let jsonAssign = JSON.stringify(postData);
        // console.log(jsonAssign, "jsonAssign");

        // axios.post(releaseAssetUrl, postData).then(
        await api.post("delete_asset", postData).then(
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
              // reservedAssetApi();
              reservedOrMyassetApi();
            } else if (res.status === 202) {
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
      }else {

      }
    });
  };

  const handleOpen = () => {
    setOpen(true);
    // setOpenModel2(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleModel2Open = () => {
    setOpenModel2(true);
  };
  const handleModel2Close = () => {
    setOpenModel2(false);
  };
  const handleModel3Open = () => {
    setOpenModel3(true);
  };
  const handleModel3Close = () => {
    setOpenModel3(false);
  };

  const handleModel2CloseAndApiInput = (e) => {
    e.preventDefault();
    setOpenModel2(false);
    console.log(userID, "on add selected user");
    console.log(serverId, "on add selected server");
    assignApiFn();
  };

  // const handleChang = (event) => {
  //   setUserID(event.target.value);
  //   console.log(event.target.value, "selected user");
  // console.log(userID, "selected user");
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // user details
  const userDetails = async () => {
    // const getUsersUrl = "http://localhost:5002/view_users";
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
    // console.log(getUsersUrl.data.Listusers);
  };

  // platform perform api
  const platformapi = async () => {
    // const getUsersUrl = "http://localhost:5002/view_users";
    // const getplatformUrl = await api.get("platformProfile");
    // let platformInfoObj = getplatformUrl.data.PlatformProfile;
    // setPlatformInfo(platformInfoObj);
    await api.get("platformProfile").then(
      (res) => {
        if (res.status === 200) {
          // console.log(res.data.PlatformProfile, "getPlatformProfile");

          setPlatformInfo(res.data.PlatformProfile);
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
    // setPlatformId(getplatformUrl.data.PlatformProfile.Chassis[0].Id);
    // setPlatformManufacturer(getplatformUrl.data.PlatformProfile.Chassis[0].Manufacturer);
    // setPlatformIdModel(getplatformUrl.data.PlatformProfile.Chassis[0].Model);
    // setPlatformIdPowerState(getplatformUrl.data.PlatformProfile.Chassis[0].PowerState);
    // setPlatformIdHealth(getplatformUrl.data.PlatformProfile.Chassis[0].Health);
    // setPlatformSystems(getplatformUrl.data.PlatformProfile.Chassis[0].Systems[0]);
    // setUsersData(getplatformUrl.data.PlatformProfile);
  };

  // console.log(usersData, "usersData");
  // console.log(Assigned_to, "Assigned_to");

  const callUsers = () => {
    usersData.forEach((usersDataObj) => {
      userDetailsArr.push({
        label: usersDataObj.Email_Id,
        value: usersDataObj.User_Id,
      });
    });
    // console.log(userDetailsArr, "userDetailsArr");
  };

  // console.log(userDetailsArr, "userDetailsArr");
  // const PersonNames = usersData.map(usersDataObj =>
  //   userObj = { label: usersDataObj.Email_Id, value: usersDataObj.User_Id }
  //   // return userDetailsArr.push(userObj);
  //   );
  //   console.log(PersonNames);

  // const PersonNames = PersonDetails.map(person =>
  //   <li key={person.id}>{person.name}</li>)
  // console.log(userDetailsArr, "userDetailsArr");

  usersData.forEach((usersDataObj) => {
    if (usersDataObj.Role !== "admin" && usersDataObj.Role !== "infra_admin") {
      userDetailsArr.push({
        label: usersDataObj.Email_Id,
        value: usersDataObj.User_Id,
      });
    }
  });
  console.log(userDetailsArr, "userDetailsArr");

  const openModelDiv = (s) => {
    userDetails();
    // callUsers();
    handleModel2Open();
    console.log(s, "row server id");
    setServerId(s);
  };

  const userServerAssign = (s) => {
    console.log(s, "row server id user");
    setServerId(s);
    userServerAssignApiFn(s);
  };

  const releaseBtnDiv = (s) => {
    console.log(s, "row server id");
    // setServerId(s);
    releaseApiFn(s);
  };

  const platformFn = (s) => {
    platformapi();
    handleModel3Open();
    // console.log(s, "row server id");
    // setServerId(s);
  };

  const deleteBtnDiv = () => {};

  const myAssetApi = async () => {
    if (user.Role === "user") {
      const user = localStorage.getItem("loggedInUserDetails");
      let loggedPerson = JSON.parse(user);
      let postData = {
        Assigned_to: parseInt(loggedPerson.User_Id),
      };
      // console.log(postData, "postData of user");
      await api.post("my_asset", postData).then(
        (res) => {
          if (res.status === 200) {
            console.log(res.data);
            setReservedServersData(res.data.ListAsset);
          } else if (res.status === 202) {
            // alert(res.data.Message);
            swal(res.data.Message, {
              // buttons: false,
              timer: 3000,
            });
            // console.log(res.data.Message);
          } else {
            alert("Something went wrong...Server Error!!");
          }
        },
        // (error) => {
        //   // console.log(error);
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
    } else {
    }
  };

  const reservedAssetApi = async () => {
    // let getReservedServersUrl = await api.get("list_asset/Reserved");
    // console.log(getReservedServersUrl.data, "getReservedServersUrl");
    // setReservedServersData(getReservedServersUrl.data.ListAsset);
      await api.get("list_asset/Reserved").then(
        (res) => {
          if (res.status === 200) {
    // console.log(res.data.ListAsset, "getReservedServersUrl");

            setReservedServersData(res.data.ListAsset);
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

  const reservedOrMyassetApi = () => {
    if (user.Role === "user") {
      myAssetApi();
    } else {
      reservedAssetApi();
    }
  };

  const [showServerAddBtn, setShowServerAddBtn] = useState(true);
  const serverAddBtn = () => {
    if (user.Role === "user") {
      setShowServerAddBtn(false);
    } else {
      setShowServerAddBtn(true);
    }
  };

  let servertitle;
  if (user.Role === "admin" || user.Role === "infra_admin") {
    servertitle = "Reserved Servers";
  } else {
    servertitle = "My Servers";
  }

  useEffect(() => {
    reservedOrMyassetApi();
    serverAddBtn();
    // if (user.Role === "user") {
    //   myAssetApi();
    // } else {
    //   reservedAssetApi();
    // }
    userDetails();
  }, []);

  const role = [
    {
      value: "infra admin",
      label: "Infra Admin",
    },
    {
      value: "user",
      label: "User",
    },
  ];

  const poolAssetApi = async () => {
    // const getPoolServersUrl = "http://localhost:5002/list_asset/pool";
    // const getPoolServersUrl = await api.get("list_asset/pool");
    // setAllServersData(getPoolServersUrl.data.ListAsset);
    // console.log(getPoolServersUrl.data.ListAsset);
    await api.get("list_asset/pool").then(
      (res) => {
        if (res.status === 200) {
        console.log(res.data.ListAsset, "getPoolServersUrl");
        setAllServersData(res.data.ListAsset);

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

  // const assetLocError = Asset_Location === "";
  // const purposeError = Purpose === "";

  //---------------------- /Tabs ----------------------

  return (
    <>
      {/* select user dialog */}
      <Dialog open={openModel2} className={classes.dialog}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className="selectuserheaderline">
            <Typography component="h1" variant="h6">
              Select User
            </Typography>
          </div>
          <form
            className={classes.form}
            onSubmit={(e) => handleModel2CloseAndApiInput(e)}
          >
            {/* <Grid spacing={0}> */}
            <Grid item xs={12} sm={12}>
              <TextField
                id="selectUser"
                select
                label="Select user"
                required
                fullWidth
                variant="outlined"
                value={userID}
                onChange={(event) => setUserID(event.target.value)}
              >
                {userDetailsArr.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* </Grid> */}

            <div className="subcanbtn">
              <Button
                variant="contained"
                // color="primary"
                type="submit"
                value="SUBMIT"
                id="selectAdd"
                className={classes.add}
                // onClick={handleModel2CloseAndApiInput}
              >
                SELECT
              </Button>
              <Button
                sx={{ width: "25ch" }}
                variant="contained"
                // color="primary"
                id="selectCancel"
                className={classes.cancel}
                onClick={handleModel2Close}
              >
                Close
              </Button>
            </div>
          </form>
        </Container>
      </Dialog>

      {/* platform performance dialog */}
      <Dialog open={openModel3} className={classes.dialog}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          {/* <div className={classes.dialogPaper}> */}
          <div className="platformheaderline">
            <Typography component="h1" variant="h6">
              Platform Profiler
            </Typography>
          </div>

          <div class="platformData mt-4">
            <ReactJson src={platformInfo} theme="monokai" />
          </div>
          <div className="subcanbtn">
            <Button
              sx={{ width: "25ch" }}
              variant="contained"
              // color="primary"
              id="platformClose"
              className={classes.cancel}
              onClick={handleModel3Close}
            >
              Close
            </Button>
          </div>

          {/* <div className="row flexPlatform">
                <div className="col-md-6 flexleft">
                Id
                </div>
                <div className="col-md-6 flexRight">
                {platformId}
                </div>
              </div> */}
          {/* <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Id
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {platformId}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Manufacturer
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Filtering has been entirely disabled for whole web server
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {platformManufacturer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Model
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {platformIdModel}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel4'} onChange={handleAccordianChange('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Id
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {platformId}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel5'} onChange={handleAccordianChange('panel5')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5bh-content"
                  id="panel5bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Id
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                  {platformId}
                  </Typography>
                </AccordionDetails>
              </Accordion> */}
          {/* <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    General settings
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                    Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    You are currently not an owner
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                    varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                    laoreet.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Advanced settings
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Filtering has been entirely disabled for whole web server
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                    amet egestas eros, vitae egestas augue. Duis vel est augue.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel4'} onChange={handleAccordianChange('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                    amet egestas eros, vitae egestas augue. Duis vel est augue.
                  </Typography>
                </AccordionDetails>
              </Accordion> */}

          {/* </div> */}
        </Container>
      </Dialog>

      {/* add asset */}
      {showServerAddBtn && (
        <div className="addserverbtn">
          <Button
            variant="outlined"
            // className={classes.addServerBtn}
            className="addServerBtnStyle"
            id="addAsset"
            onClick={handleOpen}
            startIcon={<DnsIcon />}
            // color="primary"
          >
            Add Asset
          </Button>
          {/* </Stack> */}
          <Dialog open={open} className={classes.dialog}>
            {/* <Box className={classes.dialogPaper}> */}
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                {/* <Avatar className={classes.avatar}></Avatar> */}
                <div className="addassetheaderline">
                  <Box m={0}>
                    <Typography
                      component="h1"
                      variant="h6"
                      className="addasseth6"
                    >
                      Add Asset
                    </Typography>
                    <Typography component="h1" variant="body2">
                      All fields are mandatory(*). Please fill all the fields
                      before submitting the form.
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
                        value={data.Asset_Name}
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
                        value={data.Manufacturer}
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
                        value={data.BMC_IP}
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
                        value={data.BMC_User}
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
                        value={data.BMC_Password}
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
                        value={data.Asset_Location}
                        onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    // required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="OS_IP"
                    label="OS IP"
                    name="OS_IP"
                    // autoFocus
                    fullWidth
                    type="text"
                    value={data.OS_IP}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    // required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="OS_User"
                    label="OS User"
                    name="OS_User"
                    fullWidth
                    // autoFocus
                    type="text"
                    value={data.OS_User}
                    onChange={(e) => handle(e)}

                    // autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //   variant="outlined-size-small"
                    variant="outlined"
                    // required
                    //   defaultValue="Small"
                    //size="small"
                    //   fullWidth
                    id="OS_Password"
                    label="OS Password"
                    name="OS_Password"
                    // autoFocus
                    fullWidth
                    type="password"
                    value={data.OS_Password}
                    onChange={(e) => handle(e)}

                        // autoComplete="lname"
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
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
                        value={data.OS_Password}
                        onChange={(e) => handle(e)}

                        // autoComplete="lname"
                      />
                    </Grid> */}

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
                      id="addAssetBtn"
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
                      id="addAssetClose"
                      className={classes.cancel}
                      onClick={handleClose}
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
        </div>
      )}

      {/* edit asset */}
      {/* <Button
        variant="outlined"
        className={classes.addServerBtn}
        onClick={handleEditOpen}
        startIcon={<DnsIcon />}
        color="primary"
      >
        Edit Server
      </Button> */}
      {/* </Stack> */}
      <Dialog open={editOpen} className={classes.dialog}>
        {/* <Box className={classes.dialogPaper}> */}
        <Container
          component="main"
          className={classes.dialogplatformContainer}
          style={{ alignContent: "center" }}
        >
          <CssBaseline />
          <div className={classes.paper}>
            <div className="editassetheaderline">
              <Box m={2}>
                <Typography component="h1" variant="h6">
                  Edit Asset
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
                    id="editAsset_Location"
                    label="Asset Location"
                    name="editAsset_Location"
                    // focused
                    type="text"
                    value={Asset_Location}
                    onChange={(e) => setAsset_location(e.target.value)}
                    // helperText={Asset_Location === "" ? "Asset Location field cannot be empty" : ""}
                    // error={Asset_Location === ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    //size="small"
                    id="editPurpose"
                    label="Purpose"
                    name="editPurpose"
                    // focused
                    fullWidth
                    type="text"
                    value={Purpose}
                    onChange={(e) => setPurpose(e.target.value)}
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
                  id="editAssetBtn"
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
                  id="editAssetClose"
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

      {/* mui-datatable for reserved and pool assets */}
      {/* <div className="flexS"> */}
      <div>
        <Stack>
          <Item>
            {/* <Box sx={{ width: "100%", typography: "body1" }}> */}
            {/* <div></div> */}
            {/* <Box sx={{ width: "100%", typography: "body2" }}> */}
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleChange} aria-label="Asset API tabs">
                  <Tab
                    label={servertitle}
                    // label="My Servers"
                    value="1"
                    // onClick={reservedAssetApi}
                    // onClick={myAssetApi}
                    onClick={reservedOrMyassetApi}
                  />
                  {/* <Tab label="Reserved" value="2" /> */}
                  <Tab label="Servers Pool" value="2" onClick={poolAssetApi} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div>
                  {/* <CacheProvider value={muiCache}> */}
                  {/* <MuiThemeProvider theme={getMuiTheme()}> */}
                  <MUIDataTable
                    title={servertitle}
                    data={reservedServersData}
                    columns={columns}
                    options={options}
                  />
                  {/* </MuiThemeProvider> */}
                  {/* </CacheProvider> */}
                </div>
              </TabPanel>
              {/* <TabPanel value="2">
              <div>
                <MUIDataTable
                  title={"Reserved Servers"}
                  data={reservedServersData}
                  columns={columns}
                  options={options}
                />
              </div>
            </TabPanel> */}
              <TabPanel value="2">
                <div>
                  {/* <h5>tab 2</h5> */}
                  <MUIDataTable
                    title={"Servers pool"}
                    data={allServersData}
                    columns={poolColumns}
                    options={options}
                  />
                </div>
              </TabPanel>
            </TabContext>
            {/* </Box> */}
            {/* </Box> */}
          </Item>
        </Stack>
      </div>
      {/* </div> */}
    </>
  );
};

export default ServersComponent;
