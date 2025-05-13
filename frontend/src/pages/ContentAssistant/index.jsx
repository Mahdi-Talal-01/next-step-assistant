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
  return <div>ContentAssistant</div>;
};

export default ContentAssistant;

