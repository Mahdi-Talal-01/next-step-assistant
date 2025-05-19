import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class TokenRepository {
  /**
   * Save tokens from OAuth for a user
   * @param {string} userId - The user ID
   * @param {object} tokenData - Token data (accessToken, refreshToken, expiryDate)
   * @returns {object} - The saved token record
   */
  async saveTokens(userId, tokenData) {
    try {
      // Check if token exists for this user
      const existingToken = await prisma.token.findUnique({
        where: { userId },
      });

      if (existingToken) {
        // Update existing token
        return await prisma.token.update({
          where: { userId },
          data: {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken || existingToken.refreshToken,
            expiryDate: tokenData.expiryDate,
            provider: "google",
            scope: tokenData.scope || existingToken.scope,
          },
        });
      } else {
        // Create new token
        return await prisma.token.create({
          data: {
            userId,
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            expiryDate: tokenData.expiryDate,
            provider: "google",
            scope: tokenData.scope || "",
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update tokens for a user
   * @param {string} userId - The user ID
   * @param {object} tokenData - Token data (accessToken, refreshToken, expiryDate)
   * @returns {object} - The updated token record
   */
  async updateTokens(userId, tokenData) {
    try {
      return await prisma.token.update({
        where: { userId },
        data: {
          ...tokenData,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get tokens by user ID
   * @param {string} userId - The user ID
   * @returns {object|null} - The token record or null
   */
  async getTokensByUserId(userId) {
    try {
      return await prisma.token.findUnique({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete tokens for a user
   * @param {string} userId - The user ID
   * @returns {object} - The deleted token record
   */
  async deleteTokens(userId) {
    try {
      return await prisma.token.delete({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new TokenRepository();
