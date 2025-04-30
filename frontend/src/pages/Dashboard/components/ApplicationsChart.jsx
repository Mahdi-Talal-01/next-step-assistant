import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../Dashboard.css";

const ApplicationsChart = ({ data }) => {
  return (
    <div className="chart-card applications-chart">
      <div className="card-header">
        <h3>Application Trends</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="dot applications"></span>
            Applications
          </span>
          <span className="legend-item">
            <span className="dot interviews"></span>
            Interviews
          </span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="applications"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="interviews"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ApplicationsChart;
