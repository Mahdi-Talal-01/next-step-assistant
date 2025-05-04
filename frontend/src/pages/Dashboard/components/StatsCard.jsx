import React from "react";
import { Icon } from "@iconify/react";
import "../Dashboard.css";

const StatsCard = ({ title, value, trend, icon, type = "primary" }) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-content">
        <div className="stat-info">
          <h3>{title}</h3>
          <h2>{value}</h2>
          <p className={`trend ${trend.type}`}>
            <Icon icon={trend.icon} />
            {trend.text}
          </p>
        </div>
        <div className="stat-icon">
          <Icon icon={icon} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
