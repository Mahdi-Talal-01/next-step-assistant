import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const SkillsSection = ({ formData, setFormData, availableSkills, isEditing }) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [showNewSkillInput, setShowNewSkillInput] = useState(false);
  const [processedSkills, setProcessedSkills] = useState([]);

  // Helper function to validate and ensure skills array
  const ensureSkillsArray = (data) => {
    if (!data.skills || !Array.isArray(data.skills)) {
      return [];
    }
    return data.skills;
  };

  // Process skills to ensure consistent format
  useEffect(() => {
    const skills = ensureSkillsArray(formData);
    const processed = skills.map(skill => {
      // Handle different potential skill formats
      if (typeof skill === 'string') {
        return { name: skill, required: true };
      }
      
      if (skill.name) {
        return { 
          name: skill.name, 
          required: skill.required !== undefined ? skill.required : true 
        };
      }
      
      if (skill.skill && skill.skill.name) {
        return { 
          name: skill.skill.name, 
          required: skill.required !== undefined ? skill.required : true,
          skillId: skill.skillId
        };
      }
      
      if (skill.skillId) {
        return { 
          name: typeof skill.skillId === 'string' ? skill.skillId : 'Unnamed Skill', 
          required: skill.required !== undefined ? skill.required : true,
          skillId: skill.skillId
        };
      }
      
      return { name: 'Unnamed Skill', required: true };
    });
    setProcessedSkills(processed);
  }, [formData.skills]);

  const handleSkillsChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions).map(option => {
      const skillName = availableSkills.find(s => s.id === option.value)?.name || option.label || option.text || '';
      return {
        name: skillName,
        required: true
      };
    });
    setFormData(prev => {
      const updatedData = { ...prev, skills: selectedSkills };
      return updatedData;
    });
  };

  const handleSkillRequirementChange = (name, required) => {
    setFormData(prev => {
      const currentSkills = ensureSkillsArray(prev);
      const updatedSkills = currentSkills.map(skill => {
        // Find the skill by name regardless of structure
        const skillName = skill.name || (skill.skill && skill.skill.name);
        if (skillName === name) {
          // Preserve the original structure but update required
          return { ...skill, required };
        }
        return skill;
      });
      
      console.log("DEBUG - SkillsSection - Updated skill requirement:", 
        name, required, JSON.stringify(updatedSkills));
      
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleAddNewSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill = {
      name: newSkillName.trim(),
      required: true
    };
    
    setFormData(prev => {
      const currentSkills = ensureSkillsArray(prev);
      const updatedSkills = [...currentSkills, newSkill];
      
      console.log("DEBUG - SkillsSection - Added new skill:", 
        newSkillName, JSON.stringify(updatedSkills));
      
      return { ...prev, skills: updatedSkills };
    });
    
    setNewSkillName('');
    setShowNewSkillInput(false);
  };

  const handleRemoveSkill = (skillName) => {
    setFormData(prev => {
      const currentSkills = ensureSkillsArray(prev);
      const updatedSkills = currentSkills.filter(skill => {
        // Check all possible ways a skill name could be stored
        const name = skill.name || (skill.skill && skill.skill.name);
        return name !== skillName;
      });
      
      console.log("DEBUG - SkillsSection - Removed skill:", 
        skillName, JSON.stringify(updatedSkills));
      
      return { ...prev, skills: updatedSkills };
    });
  };

  return (
    <div className="skills-section">
      <h3>Skills</h3>
      
      {isEditing ? (
        <>
          <div className="skills-input-container">
            {showNewSkillInput ? (
              <div className="new-skill-input">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Enter skill name"
                />
                <button 
                  onClick={handleAddNewSkill}
                  className="add-skill-btn"
                >
                  Add
                </button>
                <button 
                  onClick={() => setShowNewSkillInput(false)} 
                  className="cancel-skill-btn"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowNewSkillInput(true)}
                className="show-skill-input-btn"
              >
                <Icon icon="mdi:plus" />
                Add Skill
              </button>
            )}
          </div>
          
          {processedSkills.length > 0 && (
            <div className="skills-list">
              {processedSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span>{skill.name}</span>
                  <div className="skill-actions">
                    <label className="required-toggle">
                      <input
                        type="checkbox"
                        checked={skill.required}
                        onChange={(e) => handleSkillRequirementChange(skill.name, e.target.checked)}
                      />
                      Required
                    </label>
                    <button 
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="remove-skill-btn"
                    >
                      <Icon icon="mdi:close" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="skills-display">
          {processedSkills.length > 0 ? (
            <div className="skills-list">
              {processedSkills.map((skill, index) => (
                <div key={index} className="skill-badge">
                  {skill.name}
                  {skill.required && <span className="required-star">*</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-skills">No skills specified</p>
          )}
        </div>
      )}
    </div>
  );
};

SkillsSection.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  availableSkills: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default SkillsSection; 