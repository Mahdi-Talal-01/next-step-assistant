import { useState } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Show a notification for a set duration
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });

    // Auto-hide the notification after delay
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  return { notification, showNotification };
};
