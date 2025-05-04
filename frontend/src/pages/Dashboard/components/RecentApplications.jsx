import React from "react";
import { Icon } from "@iconify/react";
import "../Dashboard.css";

const RecentApplications = ({ applications }) => {
  return (
    <div className="card recent-applications">
      <div className="card-header">
        <h3>Recent Applications</h3>
        <button className="btn btn-link">
          View All
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.id} className="application-item">
            <div className="application-info">
              <h4>{app.company}</h4>
              <p>{app.position}</p>
              <div className="skills-tags">
                {app.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="application-status">
              <span className={`status-badge ${app.status.toLowerCase()}`}>
                {app.status}
              </span>
              <span className="date">{app.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;
