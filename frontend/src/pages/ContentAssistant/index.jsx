import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles/ContentAssistant.module.css";

// Components
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import ContentForm from "./components/ContentForm";
import ContentPreview from "./components/ContentPreview";
import Notification from "./components/Notification";

// Hooks & Services
import { useContentGenerator } from "./hooks/useContentGenerator";
import { useNotification } from "./hooks/useNotification";

const ContentAssistant = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [contentType, setContentType] = useState("jobDescription");

  const {
    formState,
    isGenerating,
    isStreaming,
    streamProgress,
    generatedContent,
    handleChange,
    handleSkillChange,
    generateContent,
    cancelGeneration,
  } = useContentGenerator(contentType);

  const { notification, showNotification } = useNotification();

  // Switch to preview tab after generation
  const handleGenerateContent = async (e) => {
    // Start with editor tab to show streaming progress
    setActiveTab("editor");

    // Generate content with streaming
    const success = await generateContent(e, true);

    if (success) {
      // Switch to preview tab once complete
      setActiveTab("preview");
      showNotification(
        `${getContentTypeLabel(contentType)} generated successfully!`
      );
    }
  };

  // Get a readable label for the content type
  const getContentTypeLabel = (type) => {
    const labels = {
      jobDescription: "Job description",
      emailReply: "Email reply",
      linkedinPost: "LinkedIn post",
      blogPost: "Blog post",
    };
    return labels[type] || type;
  };

  // Copy to clipboard handler for the preview
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification("Copied to clipboard!");
  };

  // Cancel generation
  const handleCancelGeneration = () => {
    cancelGeneration();
    showNotification("Content generation canceled");
  };

  return (
    <div className={styles.container}>
      <Notification notification={notification} />

      <Header />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.contentTypeSelector}>
          <label htmlFor="contentType">I want to create a:</label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => {
              setContentType(e.target.value);
              setActiveTab("editor");
            }}
            className={styles.contentTypeDropdown}
          >
            <option value="jobDescription">Job Description</option>
            <option value="emailReply">Email Reply</option>
            <option value="linkedinPost">LinkedIn Post</option>
            <option value="blogPost">Blog Post</option>
          </select>
        </div>

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasContent={!!generatedContent}
        />

        {activeTab === "editor" ? (
          <>
            <ContentForm
              contentType={contentType}
              formState={formState}
              isGenerating={isGenerating}
              isStreaming={isStreaming}
              handleChange={handleChange}
              handleSkillChange={handleSkillChange}
              onSubmit={handleGenerateContent}
              onCancel={handleCancelGeneration}
            />

            {isStreaming && (
              <div className={styles.streamingIndicator}>
                <div className={styles.streamingProgress}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${streamProgress}%` }}
                    ></div>
                  </div>
                  <p>
                    Generating content in real-time...{" "}
                    {streamProgress > 0 ? `${Math.round(streamProgress)}%` : ""}
                  </p>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelGeneration}
                  >
                    Cancel
                  </button>
                </div>

                {generatedContent && (
                  <div className={styles.previewBox}>
                    <h3>Live Preview:</h3>
                    <div className={styles.previewContent}>
                      {generatedContent.split("\n").map((line, i) => (
                        <div key={i}>{line || " "}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <ContentPreview
            content={generatedContent}
            contentType={contentType}
            onEdit={() => setActiveTab("editor")}
            onCopy={handleCopyToClipboard}
          />
        )}
      </motion.div>
    </div>
  );
};
export default ContentAssistant;