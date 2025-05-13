import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDate } from '../../utils/formatUtils';

// Helper function to get skill name regardless of format
const getSkillName = (skill) => {
  if (typeof skill === 'string') return skill;
  if (skill.name) return skill.name;
  if (skill.skill && skill.skill.name) return skill.skill.name;
  if (skill.skillId && typeof skill.skillId === 'string') return skill.skillId;
  return 'Unnamed Skill';
};

const CardBody = ({ application }) => {
  const { location, appliedDate, jobType, lastUpdated } = application;
  
  return (
    <div className="card-body">
      {location && (
        <div className="card-detail">
          <Icon icon="mdi:map-marker" className="detail-icon" />
          <span>{location}</span>
        </div>
      )}
      
      <div className="card-detail">
        <Icon icon="mdi:calendar" className="detail-icon" />
        <span>Applied: {formatDate(appliedDate)}</span>
      </div>
      
      {jobType && (
        <div className="card-detail">
          <Icon icon="mdi:briefcase" className="detail-icon" />
          <span>{jobType}</span>
        </div>
      )}
      
      <div className="card-detail">
        <Icon icon="mdi:clock-outline" className="detail-icon" />
        <span>Updated: {formatDate(lastUpdated)}</span>
      </div>
      
      {application.skills && application.skills.length > 0 && (
        <div className="skills-container">
          <div className="skills-wrapper">
            {application.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">
                {getSkillName(skill)}
              </span>
            ))}
            {application.skills.length > 3 && (
              <span className="more-skills">+{application.skills.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CardBody.propTypes = {
  application: PropTypes.object.isRequired,
};

export default CardBody;