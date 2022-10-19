import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Box from "@mui/material/Box";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import {
  Button,
  Container,
  CssBaseline,
  Dialog,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import DnsIcon from "@mui/icons-material/Dns";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useStyles } from "./BodyStyles";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
import "../../css/servers.css";

// const columns = [
//   { title: "field", field: "field" },
//   { title: "Email", field: "email" },
// ];

const columns = [
  {
    field: "server_id",
    title: "ID",
  },
  {
    field: "vendor",
    title: "Vendor",
  },
  {
    field: "status",
    title: "Status",
  },
  {
    field: "bmc_ip",
    title: "BMC IP",
  },
  {
    field: "team_id",
    title: "Team Id",
  },
  {
    field: "bmc_user",
    title: "BMC User",
  },
  {
    field: "bmc_password",
    title: "BMC Password",
  },
  {
    field: "server_location",
    title: "Location",
  },
  {
    field: "cpu_generation",
    title: "CPU Generation",
  },
  {
    field: "reserved",
    title: "Reserved",
  },
  {
    field: "assignee",
    title: "Assignee",
  },
  {
    field: "Assigned on",
    title: "Assigned on",
  },
  {
    field: "os_ip",
    title: "OS IP",
  },
  {
    field: "os_user",
    title: "OS User",
  },
  {
    field: "os_password",
    title: "OS Password",
  },
  {
    field: "purpose",
    title: "Purpose",
  },
  {
    field: "cluster_id",
    title: "Cluster ID",
  },
];

function ServerComponent() {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  const classes = useStyles();
  const [data, setData] = useState({
    ID: "",
    vendor: "",
    team_id: "",
    status: "",
    server_location: "",
    reserved: "",
    remarks: "",
    os_user: "",
    os_password: "",
    os_ip: "",
    cpu_generation: "",
    cluster_id: "",
    bmc_user: "",
    bmc_password: "",
    bmc_ip: "",
    assignee: "",
    assigned_on: "",
  });

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }

  //   const url = "";
  function Sub(e) {
    e.preventDefault();
    console.log("ig");
    console.log(data.ID, "ig");
    console.log(data.vendor, "ig");
    // console.log(data.assigned_on, "ig");

    // axios.post(url, {
    //   firstname: data.firstname,
    //   lastname: data.lastname,
    //   phone: parseInt(data.phone),
    //   businessemail: data.businessemail,
    //   company: data.company,
    //   joblevel: data.joblevel,
    //   describe: data.describe,
    //   country: data.country,
    //   message: data.message,
    // }).then(
    //   (res) => {
    //     if (res.status == 200) {
    //       console.log(res.data);
    //     //   reset();
    //       alert("We got your information. We will call you back soon.");
    //     } else {
    //       alert("Something went wrong...Server Error!!");
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //     alert("Refused Connection...Try again later", error);
    //   }
    // );
  }

  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [allServersData, setAllServersData] = useState([]);
  const [reservedServersData, setReservedServersData] = useState([]);

  const allServData = (index) => {
    setToggleState(index);
    // const getPoolServersUrl = "http://127.0.0.1:5002/filter_server_pool";
    // const getPoolServersUrl = "http://127.0.0.1:5002/view/server/pool/";
    // const getAllServersUrl = "http://127.0.0.1:5002/servers/all";
    const getAllServersUrl = "http://localhost:5002/list_asset";
    axios.get(getAllServersUrl).then((res) => {
      setAllServersData(res.data);
    });
  };

  const getReservedServersUrl = "http://localhost:5002/list_asset/Reserved";

  //   const reservedServData = () => {
  //     // const getPoolServersUrl = "http://127.0.0.1:5002/filter_server_pool";
  //     // const getPoolServersUrl = "http://127.0.0.1:5002/view/server/pool/";
  //     // const getAllServersUrl = "http://127.0.0.1:5002/servers/all";
  //     // const getReservedServersUrl = "http://127.0.0.1:5002/view_server";
  //     axios.get(getReservedServersUrl).then((res) => {
  //       setReservedServersData(res.data);
  //     });
  //   };

  // const getReservedServersUrl = "http://127.0.0.1:5002/view/server/reserved/";
  // const getReservedServersUrl = "http://127.0.0.1:5002/filter_server_reserve";

  useEffect(() => {
    axios.get(getReservedServersUrl).then((res) => {
      setReservedServersData(res.data);
    });
  }, []);

  return (
    <>
      <div>ServerComponent</div>
      {/* <MaterialTable columns={columns} /> */}

      <Button
        variant="outlined"
        className={classes.addServerBtn}
        onClick={handleOpen}
        startIcon={<DnsIcon />}
        color="primary"
      >
        Add Server
      </Button>
      {/* </Stack> */}
      <Dialog open={open} className={classes.dialog}>
        <Box className={classes.dialogPaper}>
          <Container component="main" className={classes.dialogContainer}>
            <CssBaseline />
            <div className={classes.dialogPaper}>
              <Typography component="h1" variant="h5">
                Add Server
              </Typography>
              {/* <Button variant="contained" >
                Send
              </Button> */}

              <form
                className={classes.form}
                noValidate
                onSubmit={(e) => Sub(e)}
              >
                <Grid container spacing={(0, 0, 0, 6)}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      // autoComplete="fname"
                      name="ID"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="ID"
                      label="ID"
                      focused
                      type="number"
                      value={data.ID}
                      onChange={(e) => handle(e)}

                      //   autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="vendor"
                      label="Vendor"
                      name="Vendor"
                      focused
                      type="text"
                      value={data.vendor}
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      // autoComplete="fname"
                      name="BMC IP"
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="bmc_ip"
                      label="BMC IP"
                      focused
                      onChange={(e) => handle(e)}

                      //   autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="location"
                      label="Location"
                      name="Location"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="bmc_user"
                      label="BMC USER"
                      name="BMC USER"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="bmc_password"
                      label="BMC PASSWORD"
                      name="BMC PASSWORD"
                      focused
                      type="password"
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="reserved"
                      label="Reserved"
                      name="Reserved"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="os_ip"
                      label="OS IP"
                      name="OS IP"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="os_user"
                      label="OS USER"
                      name="OS USER"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="os_password"
                      label="OS PASSWORD"
                      name="OS PASSWORD"
                      focused
                      type="password"
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="assigned_to"
                      label="Assigned To"
                      name="Assigned To"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      variant="standard"
                      required
                      size="small"
                      id="assigned_on"
                      label="Assigned On"
                      name="Assigned On"
                      focused
                    /> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        {/* <DateTimePicker
                          label="Date&Time picker"
                          value={value}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params} />}
                        /> */}
                        <MobileDatePicker
                          label="Date mobile"
                          inputFormat="dd/MM/yyyy"
                          size="small"
                          id
                          value={value}
                          onChange={handleChange}
                          //   onChange={(e) => handle(e)}
                          //   value={data.assigned_on}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="remarks"
                      label="Remarks"
                      name="Remarks"
                      focused
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      //   variant="outlined-size-small"
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="cpu_gen"
                      label="CPU Gen"
                      name="CPU Gen"
                      // autoComplete="lname"
                      focused
                      onChange={(e) => handle(e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="team_id"
                      label="Team ID"
                      name="Team ID"
                      focused
                      type="number"
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      variant="standard"
                      required
                      //   defaultValue="Small"
                      size="small"
                      //   fullWidth
                      id="cluster_id"
                      label="Cluster ID"
                      name="Cluster ID"
                      focused
                      type="number"
                      onChange={(e) => handle(e)}

                      // autoComplete="lname"
                    />
                  </Grid>
                </Grid>
                <Button
                  //   type="submit"
                  // fullWidth
                  type="submit"
                  value="SUBMIT"
                  sx={{ width: "25ch" }}
                  variant="contained"
                  color="secondary"
                  className={classes.add}
                >
                  Add
                </Button>
                <Button
                  //   type="submit"
                  // fullWidth
                  sx={{ width: "25ch" }}
                  variant="contained"
                  color="primary"
                  className={classes.cancel}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </form>
            </div>
          </Container>
        </Box>
      </Dialog>
      <div className="container">
        <div className="bloc-tabs">
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            Tab 1
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => allServData(2)}
          >
            Tab 2
          </button>
          {/* <button
            className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            Tab 3
          </button> */}
        </div>

        <div className="content-tabs">
          <div
            className={
              toggleState === 1 ? "content  active-content" : "content"
            }
          >
            <MaterialTable
              title={"My Servers"}
              columns={columns}
              data={reservedServersData}
            />
          </div>

          <div
            className={
              toggleState === 2 ? "content  active-content" : "content"
            }
          >
            {/* <div> */}
            <MaterialTable
              title={"All Servers"}
              columns={columns}
              data={allServersData}
            />
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ServerComponent;
