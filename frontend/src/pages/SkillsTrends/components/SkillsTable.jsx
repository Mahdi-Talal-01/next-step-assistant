import React from 'react';
import { Icon } from '@iconify/react';

const SkillsTable = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="skills-table">
        <h2>Trending Skills</h2>
        <div className="empty-state">
          <Icon icon="mdi:information-outline" style={{ fontSize: '2rem', color: '#718096', marginBottom: '1rem' }} />
          <p>No skills data available at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-table">
      <h2>
        <Icon icon="mdi:chart-line" style={{ color: '#4a6cf7', marginRight: '0.5rem' }} />
        Trending Skills
      </h2>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Growth</th>
              <th>Demand</th>
              <th>Avg. Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={skill.id || index}>
                <td>
                  <div style={{ fontWeight: '600' }}>{skill.name}</div>
                </td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px', 
                    backgroundColor: '#f1f5f9', 
                    fontSize: '0.8rem',
                    color: '#4a5568',
                    fontWeight: '500'
                  }}>
                    {skill.category}
                  </span>
                </td>
                <td>
                  <div className={`growth-indicator ${skill.growth >= 0 ? 'positive' : 'negative'}`}>
                    <Icon icon={skill.growth >= 0 ? "mdi:trending-up" : "mdi:trending-down"} />
                    {skill.growth.toFixed(1)}%
                  </div>
                </td>
                <td>
                  <div className="demand-bar">
                    <div 
                      className="demand-fill" 
                      style={{ width: `${Math.min(skill.demand * 5, 100)}%` }}
                    />
                    <span>{skill.demand}</span>
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>${skill.salary.toLocaleString()}</td>
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