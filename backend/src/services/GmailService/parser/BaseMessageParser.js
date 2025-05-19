import IMessageParser from '../interfaces/IMessageParser.js';

/**
 * Basic implementation of email message parser
 */
class BaseMessageParser extends IMessageParser {
  /**
   * Parse Gmail message to a more readable format, with HTML body
   * @param {object} message - Gmail message
   * @returns {object} - Parsed email
   */
  parseMessage(message) {
    try {
      if (!message || !message.payload) {
        console.warn("Invalid message format:", message?.id);
        return {
          id: message?.id || "unknown",
          threadId: message?.threadId || "unknown",
          subject: "",
          from: "",
          to: "",
          date: new Date().toISOString(),
          body: "",
          snippet: message?.snippet || "",
          labels: message?.labelIds || [],
          isUnread: false,
          hasAttachments: false
        };
      }

      // Base64URL → UTF-8
      const decode = (b64url) =>
        Buffer.from(
          b64url.replace(/-/g, "+").replace(/_/g, "/"),
          "base64"
        ).toString("utf8");

      /**
       * Recursively search payload parts for HTML, then plain text.
       * Returns decoded string or empty.
       */
      const extractHtml = (part) => {
        if (part.mimeType === "text/html" && part.body?.data) {
          return decode(part.body.data);
        }
        if (part.parts && part.parts.length) {
          // first pass: look for HTML
          for (let p of part.parts) {
            const html = extractHtml(p);
            if (html) return html;
          }
          // second pass: look for plain text and wrap it
          for (let p of part.parts) {
            if (p.mimeType === "text/plain" && p.body?.data) {
              return `<pre style="white-space: pre-wrap;">${decode(
                p.body.data
              )}</pre>`;
            }
          }
          // nothing matching? dive into first part
          return extractHtml(part.parts[0]);
        }
        return "";
      };

      // Check for attachments
      const hasAttachments = (part) => {
        if (part.filename && part.filename.length > 0) {
          return true;
        }
        if (part.parts && part.parts.length) {
          for (let p of part.parts) {
            if (hasAttachments(p)) return true;
          }
        }
        return false;
      };

      const { payload } = message;
      const headers = payload.headers || [];

      // header extraction (subject, from, to, date)
      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name)?.value || "";

      const subject = getHeader("subject");
      const from = getHeader("from");
      const to = getHeader("to");
      const date = getHeader("date");

      // pull HTML body (or plain-text fallback wrapped in <pre>)
      const body = extractHtml(payload);

      return {
        id: message.id,
        threadId: message.threadId,
        subject,
        from,
        to,
        date,
        body,
        snippet: message.snippet || "",
        labels: message.labelIds || [],
        isUnread: (message.labelIds || []).includes("UNREAD"),
        hasAttachments: hasAttachments(payload)
      };
    } catch (err) {
      console.error("parseMessage error:", err);
      return {
        id: message?.id || "unknown",
        threadId: message?.threadId || "unknown",
        subject: "Error",
        from: "",
        to: "",
        date: new Date().toISOString(),
        body: "",
        snippet: "Could not parse email",
        labels: [],
        isUnread: false,
        hasAttachments: false
      };
    }
  }
}

export default BaseMessageParser; 