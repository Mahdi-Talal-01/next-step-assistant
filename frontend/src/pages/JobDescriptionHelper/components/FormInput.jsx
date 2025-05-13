import React from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/ContentAssistant.module.css';

const FormInput = ({ 
  id, 
  name, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  icon, 
  children 
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputWrapper}>
        {icon && <Icon icon={icon} className={styles.inputIcon} />}
        {children || (
          <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={styles.input}
            required={required}
          />
        )}
      </div>
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.string,
  children: PropTypes.node
};

export default FormInput; 