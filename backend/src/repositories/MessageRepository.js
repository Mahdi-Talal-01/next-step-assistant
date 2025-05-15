const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MessageRepository {
  /**
   * Save a new message
   * @param {string} userId - The user ID
   * @param {string} content - The message content
   * @param {string} type - The message type ('user' or 'assistant')
   * @param {Object} metadata - Optional metadata for the message
   * @returns {Promise<Object>} - The created message
   */
  async saveMessage(userId, content, type, metadata = null) {
    try {
      const message = await prisma.message.create({
        data: {
          userId,
          content,
          type,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
      return message;
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  }
  /**
   * Get messages for a user
   * @param {string} userId - The user ID
   * @param {number} limit - Maximum number of messages to return
   * @returns {Promise<Array>} - List of messages
   */
  async getMessagesByUserId(userId, limit = 50) {
    try {
      const messages = await prisma.message.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: limit,
      });

      // Parse metadata JSON if it exists
      return messages.map((message) => ({
        ...message,
        metadata: message.metadata ? JSON.parse(message.metadata) : null,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}

module.exports = new MessageRepository();
