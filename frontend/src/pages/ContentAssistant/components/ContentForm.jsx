import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import styles from "../styles/ContentAssistant.module.css";

// Components
import FormInput from "./FormInput";
import SkillInput from "./SkillInput";
import SkillList from "./SkillList";

// Constants
import {
  INDUSTRIES,
  EXPERIENCE_LEVELS,
  TONE_OPTIONS,
  LENGTH_OPTIONS,
} from "../constants/formOptions";

const ContentForm = ({
  contentType,
  formState,
  isGenerating,
  isStreaming,
  handleChange,
  handleSkillChange,
  onSubmit,
  onCancel,
}) => {
  // Render different forms based on content type
  const renderFormFields = () => {
    switch (contentType) {
      case "jobDescription":
        return renderJobDescriptionForm();
      case "emailReply":
        return renderEmailReplyForm();
      case "linkedinPost":
        return renderLinkedInPostForm();
      case "blogPost":
        return renderBlogPostForm();
      default:
        return <p>Unknown content type selected</p>;
    }
  };

  // Job Description Form Fields
  const renderJobDescriptionForm = () => (
    <>
      <div className={styles.formGrid}>
        {/* Job Title */}
        <FormInput
          id="jobTitle"
          name="jobTitle"
          label="Job Title"
          placeholder="e.g. Frontend Developer"
          value={formState.jobTitle}
          onChange={handleChange}
          required
          icon="mdi:briefcase"
        />

        {/* Industry */}
        <FormInput
          id="industry"
          name="industry"
          label="Industry"
          value={formState.industry}
          onChange={handleChange}
          required
          icon="mdi:domain"
        >
          <select
            id="industry"
            name="industry"
            value={formState.industry}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="" disabled>
              Select an industry
            </option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </FormInput>

        {/* Experience Level */}
        <FormInput
          id="experience"
          name="experience"
          label="Experience Level"
          value={formState.experience}
          onChange={handleChange}
          icon="mdi:account-star"
        >
          <select
            id="experience"
            name="experience"
            value={formState.experience}
            onChange={handleChange}
            className={styles.select}
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </FormInput>

        {/* Remote Option */}
        <div className={styles.formGroup}>
          <div className={styles.checkboxWrapper}>
            <label htmlFor="isRemote" className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formState.isRemote}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Remote Position</span>
            </label>
          </div>
        </div>
      </div>

      {/* Skills */}
      <FormInput id="skills" name="skills" label="Required Skills" required>
        <div>
          <SkillInput
            value={formState.skillInput}
            onChange={handleSkillChange.updateInput}
            onKeyPress={handleSkillChange.handleKeyPress}
            onAdd={handleSkillChange.addSkill}
            inputRef={handleSkillChange.inputRef}
          />

          <SkillList
            skills={formState.skills}
            onRemove={handleSkillChange.removeSkill}
          />
        </div>
      </FormInput>

      {/* Responsibilities */}
      <FormInput
        id="responsibilities"
        name="responsibilities"
        label="Job Responsibilities"
        value={formState.responsibilities}
        onChange={handleChange}
        icon="mdi:clipboard-text"
      >
        <textarea
          id="responsibilities"
          name="responsibilities"
          placeholder="Describe the key responsibilities and duties for this role"
          value={formState.responsibilities}
          onChange={handleChange}
          className={styles.textarea}
          rows={4}
        />
      </FormInput>
    </>
  );

  // Email Reply Form Fields
  const renderEmailReplyForm = () => (
    <>
      {/* Original Email */}
      <FormInput
        id="originalEmail"
        name="originalEmail"
        label="Original Email"
        required
        icon="mdi:email"
      >
        <textarea
          id="originalEmail"
          name="originalEmail"
          placeholder="Paste the email you want to reply to"
          value={formState.originalEmail}
          onChange={handleChange}
          className={styles.textarea}
          rows={6}
          required
        />
      </FormInput>

      <div className={styles.formGrid}>
        {/* Tone */}
        <FormInput
          id="tone"
          name="tone"
          label="Tone"
          value={formState.tone}
          onChange={handleChange}
          icon="mdi:volume-high"
        >
          <select
            id="tone"
            name="tone"
            value={formState.tone}
            onChange={handleChange}
            className={styles.select}
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </FormInput>
      </div>

      {/* Skills (Optional) */}
      <FormInput id="skills" name="skills" label="Relevant Skills (Optional)">
        <div>
          <SkillInput
            value={formState.skillInput}
            onChange={handleSkillChange.updateInput}
            onKeyPress={handleSkillChange.handleKeyPress}
            onAdd={handleSkillChange.addSkill}
            inputRef={handleSkillChange.inputRef}
          />

          <SkillList
            skills={formState.skills}
            onRemove={handleSkillChange.removeSkill}
          />
        </div>
      </FormInput>

      {/* Additional Context */}
      <FormInput
        id="additionalContext"
        name="additionalContext"
        label="Additional Context"
        value={formState.additionalContext}
        onChange={handleChange}
        icon="mdi:information"
      >
        <textarea
          id="additionalContext"
          name="additionalContext"
          placeholder="Add any additional context or points you want to include in the reply"
          value={formState.additionalContext}
          onChange={handleChange}
          className={styles.textarea}
          rows={3}
        />
      </FormInput>
    </>
  );

  // LinkedIn Post Form Fields
  const renderLinkedInPostForm = () => (
    <>
      {/* Topic */}
      <FormInput
        id="topic"
        name="topic"
        label="Topic"
        placeholder="e.g. Leadership in remote teams"
        value={formState.topic}
        onChange={handleChange}
        required
        icon="mdi:tag"
      />

      {/* Goal */}
      <FormInput
        id="goal"
        name="goal"
        label="Post Goal"
        value={formState.goal}
        onChange={handleChange}
        required
        icon="mdi:target"
      >
        <textarea
          id="goal"
          name="goal"
          placeholder="What is the main message you want to convey?"
          value={formState.goal}
          onChange={handleChange}
          className={styles.textarea}
          rows={3}
          required
        />
      </FormInput>

      <div className={styles.formGrid}>
        {/* Tone */}
        <FormInput
          id="tone"
          name="tone"
          label="Tone"
          value={formState.tone}
          onChange={handleChange}
          icon="mdi:volume-high"
        >
          <select
            id="tone"
            name="tone"
            value={formState.tone}
            onChange={handleChange}
            className={styles.select}
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </FormInput>

        {/* Include Hashtags */}
        <div className={styles.formGroup}>
          <div className={styles.checkboxWrapper}>
            <label htmlFor="includeHashtags" className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="includeHashtags"
                name="includeHashtags"
                checked={formState.includeHashtags}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Include Hashtags</span>
            </label>
          </div>
        </div>
      </div>

      {/* Skills (Keywords) */}
      <FormInput id="skills" name="skills" label="Keywords/Skills to Highlight">
        <div>
          <SkillInput
            value={formState.skillInput}
            onChange={handleSkillChange.updateInput}
            onKeyPress={handleSkillChange.handleKeyPress}
            onAdd={handleSkillChange.addSkill}
            inputRef={handleSkillChange.inputRef}
          />

          <SkillList
            skills={formState.skills}
            onRemove={handleSkillChange.removeSkill}
          />
        </div>
      </FormInput>
    </>
  );

  // Blog Post Form Fields
  const renderBlogPostForm = () => (
    <>
      {/* Title */}
      <FormInput
        id="title"
        name="title"
        label="Blog Title"
        placeholder="e.g. 10 Ways to Improve Your Productivity"
        value={formState.title}
        onChange={handleChange}
        required
        icon="mdi:format-title"
      />

      {/* Target Audience */}
      <FormInput
        id="targetAudience"
        name="targetAudience"
        label="Target Audience"
        placeholder="e.g. Marketing professionals"
        value={formState.targetAudience}
        onChange={handleChange}
        required
        icon="mdi:account-group"
      />

      {/* Key Points */}
      <FormInput
        id="keyPoints"
        name="keyPoints"
        label="Key Points"
        value={formState.keyPoints}
        onChange={handleChange}
        required
        icon="mdi:format-list-bulleted"
      >
        <textarea
          id="keyPoints"
          name="keyPoints"
          placeholder="List the main points you want to cover in your blog post (one per line)"
          value={formState.keyPoints}
          onChange={handleChange}
          className={styles.textarea}
          rows={4}
          required
        />
      </FormInput>

      <div className={styles.formGrid}>
        {/* Tone */}
        <FormInput
          id="tone"
          name="tone"
          label="Tone"
          value={formState.tone}
          onChange={handleChange}
          icon="mdi:volume-high"
        >
          <select
            id="tone"
            name="tone"
            value={formState.tone}
            onChange={handleChange}
            className={styles.select}
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </FormInput>

        {/* Desired Length */}
        <FormInput
          id="desiredLength"
          name="desiredLength"
          label="Length"
          value={formState.desiredLength}
          onChange={handleChange}
          icon="mdi:text"
        >
          <select
            id="desiredLength"
            name="desiredLength"
            value={formState.desiredLength}
            onChange={handleChange}
            className={styles.select}
          >
            {LENGTH_OPTIONS.map((length) => (
              <option key={length.value} value={length.value}>
                {length.label}
              </option>
            ))}
          </select>
        </FormInput>
      </div>

      {/* Skills */}
      <FormInput id="skills" name="skills" label="Relevant Skills/Topics">
        <div>
          <SkillInput
            value={formState.skillInput}
            onChange={handleSkillChange.updateInput}
            onKeyPress={handleSkillChange.handleKeyPress}
            onAdd={handleSkillChange.addSkill}
            inputRef={handleSkillChange.inputRef}
          />

          <SkillList
            skills={formState.skills}
            onRemove={handleSkillChange.removeSkill}
          />
        </div>
      </FormInput>
    </>
  );

  return (
    <motion.div
      className={styles.editorContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={onSubmit} className={styles.form}>
        {renderFormFields()}

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            type="submit"
            className={styles.generateButton}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className={styles.spinner}></span>
                Generating...
              </>
            ) : (
              <>
                <Icon icon="mdi:magic" className={styles.buttonIcon} />
                Generate{" "}
                {contentType === "jobDescription"
                  ? "Job Description"
                  : contentType === "emailReply"
                  ? "Email Reply"
                  : contentType === "linkedinPost"
                  ? "LinkedIn Post"
                  : "Blog Post"}
              </>
            )}
          </button>

          {(isGenerating || isStreaming) && onCancel && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              <Icon icon="mdi:close-circle" className={styles.buttonIcon} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

ContentForm.propTypes = {
  contentType: PropTypes.oneOf([
    "jobDescription",
    "emailReply",
    "linkedinPost",
    "blogPost",
  ]).isRequired,
  formState: PropTypes.object.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  isStreaming: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleSkillChange: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default ContentForm;
