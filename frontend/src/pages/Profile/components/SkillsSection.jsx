import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './SkillsSection.module.css';

const SkillsSection = ({ skills = [], onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skillsList, setSkillsList] = useState([...skills]);
  const [newSkill, setNewSkill] = useState('');
  const skillInputRef = useRef(null);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
      skillInputRef.current.focus();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = async () => {
    const result = await onUpdate(skillsList);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setSkillsList([...skills]);
    setIsEditing(false);
    setNewSkill('');
  };

  return (
    <div className={styles.skillsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <button 
          className={styles.editButton} 
          onClick={() => setIsEditing(!isEditing)}
          type="button"
        >
          {isEditing ? (
            <>
              <Icon icon="mdi:close" className={styles.buttonIcon} />
              Cancel
            </>
          ) : (
            <>
              <Icon icon="mdi:pencil" className={styles.buttonIcon} />
              Edit
            </>
          )}
        </button>
      </div>

      <div className={styles.skillsContent}>
        {isEditing ? (
          <div className={styles.skillsEditor}>
            <div className={styles.addSkillForm}>
              <div className={styles.formGroup}>
                <label htmlFor="newSkill">Add Skill</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. JavaScript, React, Node.js"
                    ref={skillInputRef}
                  />
                  <button 
                    className={styles.addButton}
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                  >
                    <Icon icon="mdi:plus" />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.skillsList}>
              {skillsList.length > 0 ? (
                skillsList.map((skill, index) => (
                  <div key={index} className={styles.skillItem}>
                    <span>{skill}</span>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveSkill(skill)}
                      type="button"
                    >
                      <Icon icon="mdi:close" />
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Icon icon="mdi:information-outline" className={styles.emptyIcon} />
                  <p>No skills added yet. Add your first skill above.</p>
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.skillsDisplay}>
            {skills.length > 0 ? (
              <div className={styles.skillTags}>
                {skills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Icon icon="mdi:information-outline" className={styles.emptyIcon} />
                <p>No skills added yet. Click the Edit button to add your skills.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SkillsSection.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string),
  onUpdate: PropTypes.func.isRequired
};

export default SkillsSection; 