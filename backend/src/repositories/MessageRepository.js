import { PrismaClient } from '@prisma/client';

// Create a new PrismaClient instance with more detailed logging
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

// Log any connection/query errors
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

/**
 * Repository for managing Message data
 */
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
      // Check if prisma is available
      if (!prisma || !prisma.message) {
        throw new Error("Prisma client or Message model is not available");
      }

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
      // Check if prisma is available
      if (!prisma || !prisma.message) {
        throw new Error("Prisma client or Message model is not available");
      }

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
      // Check if prisma is available
      if (!prisma || !prisma.message) {
        throw new Error("Prisma client or Message model is not available");
      }

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
      // Check if prisma is available
      if (!prisma || !prisma.message) {
        throw new Error("Prisma client or Message model is not available");
      }

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

export default new MessageRepository();
