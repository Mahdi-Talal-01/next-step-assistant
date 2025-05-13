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
  return (
    <div className={styles.container}>
      <Header />
      <TabNavigation />
      <ContentForm />
      <ContentPreview />
  return <div>ContentAssistant</div>;
};

export default ContentAssistant;

