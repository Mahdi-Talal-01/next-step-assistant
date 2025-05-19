import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import ApplicationModalForm from './ApplicationModalForm';
import ApplicationModalHeader from './ApplicationModalHeader';
import ApplicationModalActions from './ApplicationModalActions';
import DeleteConfirmation from './DeleteConfirmation';
import SkillsSection from './SkillsSection';
import './ApplicationModal.css';

const ApplicationModal = ({
  application,
  isNew,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = useState(application);
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    // Ensure application has skills array
    const initializedApplication = { ...application };
    if (!initializedApplication.skills || !Array.isArray(initializedApplication.skills)) {
      initializedApplication.skills = [];
    }
    
    setFormData(initializedApplication);
    setIsEditing(isNew);
    // Fetch available skills when modal opens
    fetchAvailableSkills();
    
    // Debug the initial skills state
    console.log("DEBUG - ApplicationModal - Initial skills:", 
      JSON.stringify(initializedApplication.skills));
  }, [application, isNew]);

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch('/api/skills', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setAvailableSkills(data.data);
      } else {
        console.error('Error in skills response:', data.message);
        setAvailableSkills([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setAvailableSkills([]);
    }
  };

  const handleStatusChange = (newStatus) => {
    // Create a copy of the current formData
    const updatedFormData = { ...formData };
    
    // Update the status
    updatedFormData.status = newStatus;
    updatedFormData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Get the current stages or initialize with default stages if they don't exist
    let stages = [];
    if (updatedFormData.stages && Array.isArray(updatedFormData.stages)) {
      stages = [...updatedFormData.stages];
    } else {
      // Create default stages
      const today = new Date().toISOString().split('T')[0];
      stages = [
        { name: "Applied", date: today, completed: true },
        { name: "Screening", date: null, completed: false },
        { name: "Technical Interview", date: null, completed: false },
        { name: "Onsite", date: null, completed: false },
        { name: "Offer", date: null, completed: false }
      ];
    }
    
    // Update stages based on new status
    const today = new Date().toISOString().split('T')[0];
    
    if (newStatus === 'applied') {
      // Mark only 'Applied' as completed
      stages.forEach(stage => {
        if (stage.name === 'Applied') {
          stage.completed = true;
          stage.date = today;
        } else {
          stage.completed = false;
          stage.date = null;
        }
      });
    } else if (newStatus === 'interview') {
      // Mark 'Applied' and 'Screening' as completed
      stages.forEach(stage => {
        if (stage.name === 'Applied' || stage.name === 'Screening') {
          stage.completed = true;
          if (!stage.date) stage.date = today;
        } else if (stage.name === 'Technical Interview') {
          stage.date = today;
          stage.completed = false;
        } else {
          stage.completed = false;
        }
      });
    } else if (newStatus === 'assessment') {
      // Mark 'Applied', 'Screening', 'Technical Interview' as completed
      stages.forEach(stage => {
        if (stage.name === 'Applied' || stage.name === 'Screening' || stage.name === 'Technical Interview') {
          stage.completed = true;
          if (!stage.date) stage.date = today;
        } else {
          stage.completed = false;
        }
      });
    } else if (newStatus === 'offer') {
      // Mark all stages as completed
      stages.forEach(stage => {
        stage.completed = true;
        if (!stage.date) stage.date = today;
      });
    }
    
    // Update the formData with the new stages
    updatedFormData.stages = stages;
    
    // Update the state
    setFormData(updatedFormData);
  };

  const handleSubmit = () => {
    // Make a deep copy to ensure we don't lose the skills
    const submissionData = JSON.parse(JSON.stringify(formData));
    // Ensure skills are properly formatted
    if (!submissionData.skills || !Array.isArray(submissionData.skills) || submissionData.skills.length === 0) {
      console.error("ERROR: Missing or empty skills array before submission");
      // Add a default skill if none exists
      submissionData.skills = [{ name: "General", required: true }];
    }
    
    // Double-check all skills have the proper format
    submissionData.skills = submissionData.skills.map(skill => {
      // Ensure the skill is an object with a name and required property
      if (typeof skill === 'string') {
        return { name: skill, required: true };
      }
      
      // If it's already an object with a name, use it
      if (typeof skill === 'object' && skill !== null && skill.name) {
        return { 
          name: skill.name,
          required: skill.required ?? true
        };
      }
      
      // Fallback
      return { name: "General", required: true };
    });
    // Make the update call
    onUpdate(submissionData);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(application.id);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="application-modal">
        <ApplicationModalHeader 
          isNew={isNew} 
          isEditing={isEditing}
          onClose={onClose}
          setIsEditing={setIsEditing}
        />

        {showDeleteConfirm ? (
          <DeleteConfirmation 
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        ) : (
          <>
            <ApplicationModalForm
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              handleStatusChange={handleStatusChange}
            />

            <SkillsSection
              formData={formData}
              setFormData={setFormData}
              availableSkills={availableSkills}
              isEditing={isEditing}
            />

            <ApplicationModalActions
              isNew={isNew}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleDelete={handleDelete}
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          </>
        )}
      </div>
    </div>
  );
};

ApplicationModal.propTypes = {
  application: PropTypes.object.isRequired,
  isNew: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ApplicationModal; 