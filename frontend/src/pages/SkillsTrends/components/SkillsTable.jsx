import React from 'react';
import { Icon } from '@iconify/react';

const SkillsTable = ({ skills }) => {
  return (
    <div className="skills-table">
      <h2>Trending Skills</h2>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Growth</th>
              <th>Demand</th>
              <th>Avg. Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={index}>
                <td>{skill.name}</td>
                <td>
                  <div className="growth-indicator positive">
                    <Icon icon="mdi:trending-up" />
                    {skill.growth}%
                  </div>
                </td>
                <td>
                  <div className="demand-bar">
                    <div 
                      className="demand-fill" 
                      style={{ width: `${skill.demand}%` }}
                    />
                    <span>{skill.demand}%</span>
                  </div>
                </td>
                <td>${skill.salary.toLocaleString()}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn" title="View Resources">
                      <Icon icon="mdi:book-open" />
                    </button>
                    <button className="action-btn" title="View Jobs">
                      <Icon icon="mdi:briefcase" />
                    </button>
                    <button className="action-btn" title="Add to Learning Path">
                      <Icon icon="mdi:plus" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillsTable; 