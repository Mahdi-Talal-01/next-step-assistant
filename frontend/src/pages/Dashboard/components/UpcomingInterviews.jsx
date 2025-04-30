import React from 'react';
import { Icon } from '@iconify/react';
import '../Dashboard.css';

const UpcomingInterviews = ({ interviews }) => {
  return (
    <div className="card upcoming-interviews">
      <div className="card-header">
        <h3>Upcoming Interviews</h3>
        <button className="btn btn-link">
          View All
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
      <div className="interviews-list">
        {interviews.map((interview) => (
          <div key={interview.id} className="interview-item">
            <div className="interview-info">
              <h4>{interview.company}</h4>
              <p>{interview.position}</p>
              <span className="interview-type">{interview.type}</span>
            </div>
            <div className="interview-time">
              <span className="date">{interview.date}</span>
              <span className="time">{interview.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingInterviews; 