// import React, { useState, useEffect } from "react";
// import "./pie.scss";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// // import axios from "axios";
// import axios from "../../../utils/api";

// const Pie1 = () => {
//   const [data, setData] = useState("");
//   const [vacant, setVacant] = useState(0);
//   const [reserved, setReserved] = useState(0);

//   useEffect(() => {
//     fetchDetails();
//   }, []);
//   const fetchDetails = async () => {
//     const { data } = await axios.get("dashboard2");
//     setData(data);
//     setVacant(data?.vacant);
//     setReserved(data?.reserved);
//   };
//   console.log("kichu", data);
//   let total = vacant + reserved;
//   let value = 0;
//   if (total > 0) {
//     value = ((reserved / total) * 100).toFixed(0);
//   }

//   console.log("perce", value);
//   console.log("total", total);
//   return (
//     <div className="Pie">
//       <div className="top">
//         <h1 className="title">Total clusters</h1>
//         <MoreVertIcon fontSize="small" />
//       </div>
//       <div className="bottom">
//         <div className="featuredChart">
//           <CircularProgressbar
//             className="CircularProgressbar"
//             value={value}
//             text={`${value}%`}
//             strokeWidth={8}
//             styles={{
//               // Customize the root svg element
//               root: {},
//               // Customize the path, i.e. the "completed progress"
//               path: {
//                 // Path color
//                 stroke: `rgba(62, 152, 199, ${value / 100})`,
//                 // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
//                 strokeLinecap: "butt",
//                 // Customize transition animation
//                 transition: "stroke-dashoffset 0.5s ease 0s",
//                 // Rotate the path
//                 transform: "rotate(0.25turn)",
//                 transformOrigin: "center center",
//               },
//               // Customize the circle behind the path, i.e. the "total progress"
//               trail: {
//                 // Trail color
//                 stroke: "#d6d6d6",
//                 // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
//                 strokeLinecap: "butt",
//                 // Rotate the trail
//                 transform: "rotate(0.25turn)",
//                 transformOrigin: "center center",
//               },
//               // Customize the text
//               text: {
//                 // Text color
//                 fill: "#f88",
//                 // Text size
//                 fontSize: "16px",
//               },
//               // Customize background - only used when the `background` prop is true
//               background: {
//                 fill: "#3e98c7",
//               },
//             }}
//           />
//         </div>

//         <div className="summary">
//           <div className="item"></div>
//           <div className="item">
//             <div className="itemTitle">clusters not use</div>
//             <div className="itemResult positive">
//               <div className="resultAmount">{data.vacant}</div>
//             </div>
//           </div>
//           <div className="item">
//             <div className="itemTitle">clusters in use</div>
//             <div className="itemResult positive">
//               <div className="resultAmount">{data.reserved}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pie1;

import "./pie.scss";
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

export default function App() {
  const [data, setData] = useState([]);
  // const [fdata, setFdata] = useState([]);

  // const filterd = fdata.filter(function (element) {
  //   return (element = data.Location);
  // });
  // console.log("filter", filterd);
  function handleChange(event) {
    console.log("hiii", data?.Dashboard?.Time);
  }
  useEffect(() => {
    fetchDetails();
  }, []);
  const fetchDetails = async () => {
    const { data } = await axios.get("dashboard5");
    setData(data);
  };
  // console.log("ggg", data);
  return (
    <Fragment>
      <div className="bar">
        <div className="top">
          <h1 className="title">Server Age </h1>
          {/* <MoreVertIcon fontSize="small" /> */}
        </div>

        {/* <div> */}
        {/* <Autocomplete
            id="countryselect"
            sx={{ width: 150 }}
            options={data?.Dashboard}
            autoHighlight
            onChange={(e) => handleChange()}
            getOptionLabel={(options) => options.Time}
            renderOption={(props, Option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {Option.Time}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a Location"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div> */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            width="100%"
            height={400}
            data={data?.Dashboard}
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
              dataKey="Time"
              axisLine={false}
              tickLine={false}
            />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar barSize={40} dataKey="Reserved" stackId="a" fill="#6666ff" />
            <Bar barSize={40} dataKey="Vacant" stackId="a" fill=" #bb9cf0" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
}
