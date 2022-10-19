import React, { useCallback, useState, useEffect } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./dotnet.scss";
import axios from "../../../utils/api";
import api from "../../../utils/api";

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={"#6666ff"}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="green"
      >{`Servers: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="red"
      >
        {`( ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  const [data, setData] = useState([]);
  const data1 = [
    { name: "Reserved", value: data.reserved },
    { name: "Vacant", value: data.vacant },
  ];

  useEffect(() => {
    fetchDetails();
  }, []);
  const fetchDetails = async () => {
    const { data } = await api.get("dashboard1");
    setData(data);
  };
  return (
    <div className="Dotnet">
      <div className="top">
        <h1 className="title">Server Details</h1>
        {/* <MoreVertIcon fontSize="small" /> */}
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <PieChart className="CircularProgressbar" width={600} height={800}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data1}
              cx={200}
              cy={200}
              innerRadius={80}
              outerRadius={100}
              fill="#bb9cf0"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </div>

        <div className="summary">
          <div className="item"></div>
          <div className="item">
            {/* <div className="itemTitle">clusters not use</div> */}
            <div className="itemResult positive">
              {/* <div className="resultAmount">{data.vacant}</div> */}
            </div>
          </div>
          <div className="item">
            {/* <div className="itemTitle">clusters in use</div> */}
            <div className="itemResult positive">
              {/* <div className="resultAmount">{data.reserved}</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
