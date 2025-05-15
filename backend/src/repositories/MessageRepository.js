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
}

module.exports = new MessageRepository();
