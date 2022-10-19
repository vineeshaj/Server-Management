import "./bar.scss";
import React, { Fragment } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../utils/api";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import api from "../../../utils/api";

export default function App() {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  // const [fdata, setFdata] = useState([]);

  // const filterd = fdata.filter(function (element) {
  //   return (element = data.Location);
  // });
  // console.log("filter", filterd);

  function handleChange(e) {
    const words = e.split("-");
    var ind = words[2];
    let value = data1[ind];
    // setData1(value);
    let arr = [];
    arr.push(value);
    setData(arr);
    console.log(arr, "data for now use");
  }
  useEffect(() => {
    fetchDetails();
  }, []);
  const fetchDetails = async () => {
    const { data } = await api.get("dashboard3");
    setData(data.Dashboard);
    setData1(data.Dashboard);
  };
  var bardata = "";
  if (data1 != null) {
    bardata = data1;
  } else {
    bardata = data;
  }

  // var bardata = "";
  // if (data1 == null) {
  //   bardata = {
  //     Location: data1?.Location,
  //     Reserved: data1?.Reserved,
  //     Vacant: data1?.Vacant,
  //   };
  // } else {
  //   bardata = data?.Dashboard;
  // }

  return (
    <Fragment>
      <div className="bar">
        <div className="top">
          <h1 className="title">Server Details by Location </h1>
          {/* <MoreVertIcon fontSize="small" /> */}
        </div>
        <div>
          <Autocomplete
            id="countryselect"
            sx={{ width: 150 }}
            options={data1}
            autoHighlight
            onChange={(e) => handleChange(e.target.id)}
            getOptionLabel={(options) => options.Location}
            renderOption={(props, Option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {Option.Location}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label=" Location"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>
        <ResponsiveContainer width="100%" height={400} if>
          <BarChart
            width="100%"
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              opacity={0.1}
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              padding={{ left: 30, right: 30 }}
              dataKey="Location"
              axisLine={false}
              tickLine={false}
            />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar barSize={40} dataKey="Reserved" stackId="a" fill="#6666ff" />
            <Bar barSize={40} dataKey="Vacant" stackId="a" fill="#bb9cf0" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
}
