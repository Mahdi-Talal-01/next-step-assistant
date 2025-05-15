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
  /**
   * Get conversation history (as pairs of user and assistant messages)
   * @param {string} userId - The user ID
   * @param {number} limit - Maximum number of conversation pairs to return
   * @returns {Promise<Array>} - List of conversation pairs
   */
  async getConversationHistory(userId, limit = 10) {
    try {
      const messages = await prisma.message.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: limit * 2, // Get enough messages for the requested number of pairs
      });

      // Sort by timestamp in ascending order
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Parse metadata JSON if it exists
      return messages.map((message) => ({
        ...message,
        metadata: message.metadata ? JSON.parse(message.metadata) : null,
      }));
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      throw error;
    }
  }
  /**
   * Delete all messages for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Result with count of deleted messages
   */
  async deleteAllUserMessages(userId) {
    try {
      const result = await prisma.message.deleteMany({
        where: { userId },
      });

      return {
        success: true,
        deletedCount: result.count,
      };
    } catch (error) {
      console.error("Error deleting user messages:", error);
      throw error;
    }
  }
}

module.exports = new MessageRepository();
