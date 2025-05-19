import { useState, useEffect, useCallback } from "react";
import BaseApi from "../../../commons/request";

export const useGmailApi = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user has authorized Gmail access
  const checkAuthorization = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BaseApi.get("/gmail/status");
      console.log("Auth status response:", response);

      // First log complete response
      console.log("Complete response object:", JSON.stringify(response));

      // IMPORTANT: Default to NOT authorized until confirmed
      let authStatus = false;

      // Check for explicit authorization status - prioritize data over message
      if (
        response &&
        response.data &&
        typeof response.data.isAuthorized === "boolean"
      ) {
        // Priority 1: response.data.isAuthorized
        authStatus = response.data.isAuthorized;
        console.log("Using authorization status from response.data:", authStatus);
      } else if (
        response &&
        response.success === true &&
        response.data &&
        typeof response.data.isAuthorized === "boolean"
      ) {
        // Priority 2: response.success + response.data.isAuthorized
        authStatus = response.data.isAuthorized;
        console.log("Using authorization status from response.data with success check:", authStatus);
      } else if (
        response &&
        typeof response.isAuthorized === "boolean"
      ) {
        // Priority 3: response.isAuthorized
        authStatus = response.isAuthorized;
        console.log("Using authorization status from response root:", authStatus);
      } else if (
        response &&
        response.success === true &&
        response.message &&
        typeof response.message.isAuthorized === "boolean"
      ) {
        // Priority 4 (lowest): response.message.isAuthorized
        authStatus = response.message.isAuthorized;
        console.log("Using authorization status from response.message:", authStatus);
      }

      console.log("Final parsed authorization status:", authStatus);

      setIsAuthorized(authStatus);
      setAuthChecked(true);

      // Only fetch emails if explicitly authorized
      if (authStatus) {
        fetchEmails({}, authStatus);
      }
    } catch (err) {
      console.error("Authorization check error:", err);
      
      // Always set to false when there's an error
      setIsAuthorized(false);
      setAuthChecked(true);
      
      // For other errors, set a user-friendly error message
      setError("Unable to check Gmail connection status. Please connect your Gmail account.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get authorization URL
  const getAuthUrl = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BaseApi.get("/gmail/auth");
      console.log("Auth URL response:", response);

      // Check different possibilities for how the URL might be nested
      if (response && response.authUrl) {
        return response.authUrl;
      } else if (response && response.data && response.data.authUrl) {
        return response.data.authUrl;
      } else if (typeof response === "string" && response.includes("http")) {
        return response;
      } else if (response && typeof response === "object") {
        // Log the full response to help debug
        console.log("Auth URL response structure:", JSON.stringify(response));
        // Try to find anything that looks like a URL
        for (const key in response) {
          if (
            typeof response[key] === "string" &&
            response[key].includes("accounts.google.com")
          ) {
            return response[key];
          }
          if (response[key] && typeof response[key] === "object") {
            for (const innerKey in response[key]) {
              if (
                typeof response[key][innerKey] === "string" &&
                response[key][innerKey].includes("accounts.google.com")
              ) {
                return response[key][innerKey];
              }
            }
          }
        }
      }

      // If we couldn't find a URL, log an error
      console.error(
        "Could not extract authorization URL from response:",
        response
      );
      return null;
    } catch (err) {
      console.error("Auth URL error:", err);
      setError("Failed to get authorization URL");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle authorization
  const authorizeGmail = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const authUrl = await getAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Could not get authorization URL");
      }
    } catch (err) {
      console.error("Authorization error:", err);
      setError(
        "Failed to authorize Gmail: " + (err.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  }, [getAuthUrl]);

  // Disconnect Gmail
  const disconnectGmail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await BaseApi.delete("/gmail/disconnect");
      setIsAuthorized(false);
      setEmails([]);
    } catch (err) {
      console.error("Disconnect error:", err);
      setError("Failed to disconnect Gmail");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch emails - only when explicitly triggered
  const fetchEmails = useCallback(
    async (options = {}, authStatus) => {
      try {
        // Use passed authStatus if provided, otherwise fall back to state
        const isUserAuthorized = typeof authStatus === 'boolean' ? authStatus : isAuthorized;
        
        if (!isUserAuthorized) {
          console.log("Not authorized to fetch emails");
          return [];
        }

        setIsLoading(true);
        setError(null);

        // Build query string
        const queryParams = new URLSearchParams();
        if (options?.maxResults)
          queryParams.append("maxResults", options.maxResults);
        if (options?.labelIds) queryParams.append("labelIds", options.labelIds);
        if (options?.q) queryParams.append("q", options.q);

        const queryString = queryParams.toString();
        const endpoint = queryString
          ? `/gmail/emails?${queryString}`
          : "/gmail/emails";

        console.log("Fetching emails with endpoint:", endpoint);

        const response = await BaseApi.get(endpoint);
        console.log("Fetch emails response:", response);
        console.log("Full email response JSON:", JSON.stringify(response));

        // Handle different response structures
        let emailsData = [];

        // Try to extract email data from various response structures
        if (Array.isArray(response)) {
          emailsData = response;
          console.log("Found emails in root array");
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data)
        ) {
          // Priority 1: response.data is an array
          emailsData = response.data;
          console.log("Found emails in response.data array");
        } else if (
          response &&
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Priority 2: response.data.data is an array
          emailsData = response.data.data;
          console.log("Found emails in response.data.data array");
        } else if (
          response &&
          response.success &&
          response.data &&
          Array.isArray(response.data)
        ) {
          // Priority 3: response.success + response.data is an array
          emailsData = response.data;
          console.log("Found emails in response.data array with success check");
        } else if (
          response &&
          response.success &&
          Array.isArray(response.message)
        ) {
          // Priority 4: response.message is an array
          emailsData = response.message;
          console.log("Found emails in response.message array:", emailsData.length);
        } else if (
          response &&
          response.message &&
          Array.isArray(response.message)
        ) {
          // Priority 5: response.message is an array (without success check)
          emailsData = response.message;
          console.log("Found emails in response.message array (no success check):", emailsData.length);
        }
        
        // Ensure that emailsData is always an array
        if (!Array.isArray(emailsData)) {
          console.error("Failed to extract email data from response, setting to empty array");
          console.log("Response structure was:", JSON.stringify(response));
          emailsData = [];
        } else {
          console.log("Successfully extracted emails from response:", emailsData.length);
          
          // Log a sample email to help debug the structure
          if (emailsData.length > 0) {
            console.log("Sample email object structure:", JSON.stringify(emailsData[0]));
          }
        }

        console.log(
          "Emails data extracted:",
          emailsData ? emailsData.length : 0,
          "emails"
        );

        if (!Array.isArray(emailsData)) {
          console.error("Invalid emails data format:", emailsData);
          emailsData = [];
        }

        // Transform API response to match our app's email format
        const transformedEmails = emailsData
          .map((email) => {
            try {
              if (!email) return null;

              // Log one email for debugging
              if (emailsData.indexOf(email) === 0) {
                console.log("Processing first email:", JSON.stringify(email));
              }

              // Set default category to primary if not specified
              let category = "primary";
              if (Array.isArray(email.labels)) {
                if (email.labels.includes("CATEGORY_SOCIAL")) category = "social";
                else if (email.labels.includes("CATEGORY_PROMOTIONS")) category = "promotions";
                else if (email.labels.includes("CATEGORY_UPDATES")) category = "updates";
                else if (email.labels.includes("CATEGORY_FORUMS")) category = "forums";
              }

              // Determine priority based on subject
              let priority = "normal";
              const subject = (email.subject || "").toLowerCase();
              if (subject.includes("urgent") || subject.includes("important")) {
                priority = "high";
              } else if (subject.includes("reminder") || subject.includes("follow up")) {
                priority = "medium";
              }

              // Create a well-formatted email object
              const formattedEmail = {
                id: email.id || `temp-${Math.random().toString(36).substring(7)}`,
                sender: email.from || "Unknown Sender",
                recipient: email.to || "Unknown Recipient",
                subject: email.subject || "No Subject",
                preview: email.snippet || "",
                body: email.body || "",
                timestamp: email.date ? new Date(email.date).getTime() : Date.now(),
                date: email.date || new Date().toISOString(),
                // Properly handle isRead/isUnread - if isUnread is true, isRead should be false
                isRead: email.isUnread === undefined ? true : !email.isUnread,
                isStarred: Array.isArray(email.labels) ? email.labels.includes("STARRED") : false,
                labels: Array.isArray(email.labels) ? email.labels : [],
                category: category,
                priority: priority
              };
              
              // Log the first transformed email for debugging
              if (emailsData.indexOf(email) === 0) {
                console.log("First email raw data:", email);
                console.log("First email transformed:", formattedEmail);
              }
              
              return formattedEmail;
            } catch (err) {
              console.error("Error transforming email:", err, email);
              // Return a placeholder for error cases
              return null;
            }
          })
          .filter(Boolean); // Remove any null entries

        console.log("Transformed emails:", transformedEmails.length);

        // If we got this far but have no emails, log a warning
        if (transformedEmails.length === 0) {
          console.warn("No emails were found or transformed successfully");
          
          // Log more details about what might have gone wrong
          if (emailsData.length > 0) {
            console.log("Raw email data was found but transformation failed. First raw email:", 
              JSON.stringify(emailsData[0]));
          }
        } else {
          console.log("Successfully transformed emails:", transformedEmails.length);
          console.log("First transformed email:", JSON.stringify(transformedEmails[0]));
        }

        // Update emails state
        setEmails(transformedEmails);
        console.log("Emails state updated with", transformedEmails.length, "emails");
        
        return transformedEmails;
      } catch (err) {
        console.error("Fetch emails error:", err);

        // Check for specific types of errors
        if (err.response?.status === 401) {
          setIsAuthorized(false);
          setError(
            "Gmail authorization required. Please connect your account."
          );
        } else if (err.message && err.message.includes("authorized")) {
          setIsAuthorized(false);
          setError(
            "Gmail authorization required. Please connect your account."
          );
        } else {
          setError(
            "Failed to fetch emails. Please try again or reconnect your account."
          );
        }

        setEmails([]);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthorized]
  );

  // Helper function to determine email category from labels
  const getCategoryFromLabels = (labels = []) => {
    if (!Array.isArray(labels)) return "primary";

    if (labels.includes("CATEGORY_SOCIAL")) return "social";
    if (labels.includes("CATEGORY_PROMOTIONS")) return "promotions";
    if (labels.includes("CATEGORY_UPDATES")) return "updates";
    if (labels.includes("CATEGORY_FORUMS")) return "forums";
    return "primary";
  };

  // Helper function to determine email priority
  const getPriorityFromHeaders = (email) => {
    if (!email || !email.subject) return "normal";

    // This is a simplified approach; in a real app, you'd use more sophisticated logic
    const subject = email.subject?.toLowerCase() || "";
    if (subject.includes("urgent") || subject.includes("important")) {
      return "high";
    }
    return "normal";
  };

  // Only check OAuth parameters from callback URL and check authorization status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get("connected");
    const errorParam = urlParams.get("error");

    if (connected === "true") {
      console.log(
        "OAuth callback indicates successful connection - enabling authorization"
      );
      setIsAuthorized(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Immediately fetch emails with direct authorization status
      fetchEmails({}, true);
    } else if (errorParam === "true") {
      setError(
        "Failed to connect Gmail: " +
          (urlParams.get("message") || "Unknown error")
      );
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // First check the server-side authorization status
    checkAuthorization();
    
    // No auto-enabling of authorization
    // No auto-fetching of emails
  }, [checkAuthorization, fetchEmails]);

  return {
    emails,
    isLoading,
    error,
    isAuthorized,
    authChecked,
    fetchEmails,
    authorizeGmail,
    disconnectGmail
  };
};