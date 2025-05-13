import { useState } from 'react';
export const useNotification = () => {
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
}