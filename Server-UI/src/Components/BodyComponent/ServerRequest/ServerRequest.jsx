import React from "react";
import { useState, useEffect } from "react";
// import "./App.css";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Card, CardContent, Typography } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import moment from "moment";
import useAuth from "../../auth";
import { useStyles } from "../BodyStyles";

import axios from "axios";
import api from "../../../utils/api";

import swal from "sweetalert";

// console.log("check history", history);
const filter = createFilterOptions();

const manufacturer = [
  { title: "DELL" },
  { title: "HP" },
  { title: "LENOVO" },
  { title: "ASUS" },
];
const CPU_Sockets = [{ label: "1" }, { label: "2" }, { label: "3" }];
const Cpu_model = [
  { label: "Neples" },
  { label: "Rome" },
  { label: "Milan" },
  { label: "Genova" },
  { label: "Milan X" },
  { label: "Burgamo " },
];

const Storage_Vendor = [
  { label: "Samsung" },
  { label: "Seagate" },
  { label: "Western Digital" },
];

const Storage_Controller = [
  { label: "SATA" },
  { label: "SAS" },
  { label: "Nvme" },
  { label: "Mixed" },
];

const Number_Of_Network_Ports = [
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
];

const Network_speed = [
  { label: "1 Gb " },
  { label: "10 Gb" },
  { label: "25 Gb" },
  { label: "100 Gb" },
];

function App() {
  const margin = { margin: "0 5px" };
  const navigate = useNavigate();
  console.log("first", navigate);

  const [value, setValue] = React.useState(null);
  console.log("ggggg", value);
  const [network_Type, setNetwork_Type] = useState(false);
  console.log("checking  network type", network_Type);
  // const url = "http://localhost:5002/create_request";
  const user = useAuth();
  const classes = useStyles();
  const [data, setData] = useState({
    Creator: user.Username,
    Request: false,
    Infraadmin_Comments: null,
    User_Comments: null,
    Start_Date: "",
    End_Date: "",
    Manufacturer: "",
    Number_Of_Servers: "",
    Operating_System: "",
    Cpu_model: "",
    CPU_Sockets,
    DIMM_Size: "",
    DIMM_Capacity: "",
    Storage_Vendor: "",
    Storage_Controller: "",
    Storage_Capacity: "",
    Network_Type: false,
    Network_speed: "",
    Number_Of_Network_Ports: "",
    Special_Switching_Needs: "",
  });
  console.log("c", data);
  // useEffect(() => {
  //   Submit();
  // }, []);
  // const newdate(dateStr){
  //   const date = new Date(dateStr);
  //   const iso = date.toISOString();
  //   console.log(iso);
  //   return iso
  // }
  // const newdate = (dateStr) => {
  //   const date = new Date(dateStr);
  //   const iso = date.toISOString();
  //   console.log(iso);
  //   return iso;
  // }
  const reset = () => {
    setData("");
  };
  function Submit(e) {
    e.preventDefault();
    const user = localStorage.getItem("loggedInUserDetails");
    let loggedPerson = JSON.parse(user);
    let a = {
      User_No: parseInt(loggedPerson.User_Id),
      Request: false,
      Infraadmin_Comments: "{NULL}",
      User_Comments: "{NULL}",
      Creator: data.Creator,
      Start_Date: moment(data.Start_Date).toISOString(),
      End_Date: moment(data.End_Date).toISOString(), //moment(data.End_Date).format("yyyy-MM-ddThh:mm:ss")
      Manufacturer: value.title,
      Number_Of_Servers: data.Number_Of_Servers,
      Operating_System: data.Operating_System,
      Network_Type: Boolean(network_Type),
      Cpu_model: data.Cpu_model,
      CPU_Sockets: data.CPU_Sockets,
      DIMM_Size: data.DIMM_Size,
      Storage_Vendor: data.Storage_Vendor,

      DIMM_Capacity: data.DIMM_Capacity,

      Storage_Controller: data.Storage_Controller,
      Storage_Capacity: data.Storage_Capacity,

      Network_speed: data.Network_speed,
      Number_Of_Network_Ports: data.Number_Of_Network_Ports,
      Special_Switching_Needs: data.Special_Switching_Needs,
    };
    console.log("typw", typeof data.End_Date);

    console.log(a, "checking");
    api
      .post("create_request", a)
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data);
          //   reset();
          // alert(res.data.Message);
          console.log("verify", res.data);
          // setData(res.data);
          // alert(" Sever requested succesfully ");
          // render("/listrequest");
          swal(res.data.Message, {
            buttons: false,
            timer: 3000,
          });
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
    // .catch((error) => {
    //   // if (error.res) {
    //   //   console.log(error.res);
    //   //   console.log("server responded");
    //   // } else if (error.request) {
    //   //   console.log("network error");
    //   // } else {
    //   //   console.log(error);
    //   // }
    // });
  }

  // asdfghj
  console.log("loged user ", user.Username);
  console.log("loged user ", user.Username);

  function handlechange(e) {
    console.log("kkk", e);
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    // setValue(manufacturer['']);
    console.log(newdata);
    console.log("nn", e.target.value);
  }

  return (
    <div className="App">
      <Typography gutterBottom variant="h3" align="center"></Typography>
      <Grid>
        <Card style={{ maxWidth: 600, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Typography variant="h4" color="primary">
              Request Form
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Please fill all the mandatory fields.
            </Typography>
            <form onSubmit={Submit}>
              <Grid container spacing={1}>
                <Grid xs={12} sm={6} item>
                  <TextField
                    id="Creator"
                    onChange={(e) => handlechange(e)}
                    value={user.Username}
                    type={"text"}
                    placeholder="Creator"
                    label="Creator"
                    variant="outlined"
                    fullWidth="true"
                    required="true"
                    xs={12}
                    ms={6}
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    id="Start_Date"
                    type={"datetime-local"}
                    onChange={(e) => handlechange(e)}
                    value={data.Start_Date}
                    placeholder="Start_Date"
                    label="Start Date "
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                {/* <Typography variant="body2" align="left" gutterBottom>
                  Storage : Disk boot
                </Typography> */}
                {/* <Grid container spacing={1}> */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="End_Date"
                    type={"datetime-local"}
                    onChange={(e) => handlechange(e)}
                    value={data.End_Date} //{moment(dateToBeFormate).format('DD/MM/YYYY')} data.End_Date //new Date(dateStr)
                    placeholder="End Date"
                    label="End Date"
                    variant="outlined"
                    fullWidth="true"
                    required="true"
                    xs={12}
                    ms={6}
                  />
                  {/* </Grid> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                    id="Manufacturer"
                    type={"text"}
                    placeholder="Manufacturer"
                    label="Manufacturer"
                    variant="outlined"
                    fullWidth="true"
                    required="true"
                    xs={12}
                    ms={6}
                  /> */}
                  {/* <Autocomplete
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      // Suggest the creation of a new value
                      if (params.inputValue !== "") {
                        filtered.push(`Add "${params.inputValue}"`);
                      }
                      return filtered;
                    }}
                    selectOnFocus
                    id="Manufacturer"
                    onChange={(e) => handlechange(e)}
                    // value={options.values}
                    clearOnBlur
                    handleHomeEndKeys
                    options={options}
                    renderOption={(option) => option}
                    // getOptionLabel={(option) => (options ? options.value : "")}
                    style={{ width: 280 }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="Manufacturer"
                        label="Manufacturer"
                        variant="outlined"
                      />
                    )}
                  /> */}

                  <Autocomplete
                    value={value}
                    onInputChange={(event, newValue) => {
                      if (typeof newValue === "string") {
                        setValue({
                          title: newValue,
                        });
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setValue({
                          title: newValue.inputValue,
                        });
                      } else {
                        setValue(newValue);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.title
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          inputValue,
                          title: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="Manufacturer"
                    onSelect={(e) => handlechange(e)}
                    options={manufacturer}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === "string") {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>{option.title}</li>
                    )}
                    sx={{ width: 280 }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => handlechange(e)}
                        label="Manufacturer"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="Number_Of_Servers"
                    type="number"
                    onChange={(e) => handlechange(e)}
                    value={data.Number_Of_Servers}
                    placeholder="Numer of servers"
                    label="Numer of servers"
                    variant="outlined"
                    fullWidth="true"
                    required="true"
                    xs={12}
                    ms={6}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="Operating_System"
                    type={"text"}
                    onChange={(e) => handlechange(e)}
                    value={data.Operating_System}
                    placeholder="Operating system"
                    label="Operating system"
                    variant="outlined"
                    fullWidth="true"
                    required="true"
                    xs={12}
                    ms={6}
                  />
                </Grid>
                <Grid container spacing={1}>
                  <Typography variant="body2" align="left" gutterBottom>
                    CPU :{""}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        disablePortal
                        id="Cpu_model"
                        onSelect={(e) => handlechange(e)}
                        options={Cpu_model}
                        sx={{ width: 280 }}
                        renderInput={(params) => (
                          <TextField {...params} label="CPU Model" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        disablePortal
                        id="CPU_Sockets"
                        onSelect={(e) => handlechange(e)}
                        options={CPU_Sockets}
                        sx={{ width: 280 }}
                        renderInput={(params) => (
                          <TextField
                            type={"integer"}
                            {...params}
                            label="CPU Sockets"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid container spacing={1}> */}
                <Typography variant="body2" align="left" gutterBottom>
                  RAM :{""}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="DIMM_Size"
                      onChange={(e) => handlechange(e)}
                      value={data.DIMM_Size}
                      type={"text"}
                      placeholder="DIMM Size"
                      label="DIMM Size"
                      variant="outlined"
                      fullWidth="true"
                      required="true"
                      xs={12}
                      ms={6}
                    />
                    {/* </Grid> */}
                  </Grid>
                  <Grid item xs={12} sm={6} gutterBottom>
                    <TextField
                      type={"text"}
                      id="DIMM_Capacity"
                      onChange={(e) => handlechange(e)}
                      value={data.DIMM_Capacity}
                      placeholder="DIMM Capacity"
                      label="DIMM Capacity"
                      variant="outlined"
                      fullWidth="true"
                      required="true"
                      xs={12}
                      ms={6}
                      gutterBottom
                    />
                    {/* </Grid> */}
                  </Grid>
                  {/* </Grid> */}
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Typography variant="body2" align="left" gutterBottom>
                  Storage :{"OS Boot"}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      disablePortal
                      id="Storage_Vendor"
                      onSelect={(e) => handlechange(e)}
                      options={Storage_Vendor}
                      sx={{ width: 280 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Storage Vendor" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      disablePortal
                      id="Storage_Controller"
                      onSelect={(e) => handlechange(e)}
                      options={Storage_Controller}
                      sx={{ width: 280 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Storage_Controller" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="Storage_Capacity"
                      onChange={(e) => handlechange(e)}
                      value={data.Storage_Capacity}
                      placeholder="Storage Capacity"
                      label=" Storage_Capacity"
                      variant="outlined"
                      fullWidth="true"
                      required="true"
                      xs={12}
                      ms={6}
                      gutterBottom
                    />
                    {/* </Grid> */}
                  </Grid>
                </Grid>
                {/* <Grid container spacing={1}> */}
                {/* <Typography variant="body2" align="left" gutterBottom>
                    Storage :{"Data Boot"}
                  </Typography> */}
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Grid item xs={12} sm={6}></Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Typography variant="body2" align="left" gutterBottom>
                      Network :{""}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          disablePortal
                          id="Number_Of_Network_Ports"
                          onSelect={(e) => handlechange(e)}
                          options={Number_Of_Network_Ports}
                          sx={{ width: 280 }}
                          renderInput={(params) => (
                            <TextField {...params} label="Network Ports" />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} gutterBottom>
                        <Autocomplete
                          disablePortal
                          id="Network_speed"
                          onSelect={(e) => handlechange(e)}
                          options={Network_speed}
                          sx={{ width: 280 }}
                          renderInput={(params) => (
                            <TextField {...params} label="Network speed" />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttonslabel-group-">
                            Network Type
                          </FormLabel>
                          <RadioGroup
                            value={network_Type}
                            id="Network_Type"
                            onChange={(e) => setNetwork_Type(e.target.value)}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                          >
                            <FormControlLabel
                              value={false}
                              onChange={(e) => setNetwork_Type(e.target.value)}
                              control={<Radio />}
                              label="Private"
                            />
                            <FormControlLabel
                              value={true}
                              onChange={(e) => setNetwork_Type(e.target.value)}
                              control={<Radio />}
                              label="Public"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Special Switching Need"
                        id="Special_Switching_Needs"
                        type={"text"}
                        onChange={(e) => handlechange(e)}
                        value={data.Special_Switching_Needs}
                        multiline
                        rows={4}
                        placeholder="Type your  here"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} align="right">
                    {/* <Button
                      style={margin}
                      type="reset"
                      onClick={reset}
                      variant="outlined"
                      color="primary"
                    >
                      Reset
                    </Button> */}
                    <Button
                      type="submit"
                      value="rest"
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default App;
