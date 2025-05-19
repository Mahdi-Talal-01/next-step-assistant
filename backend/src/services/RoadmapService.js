import roadmapRepository from '../repositories/RoadmapRepository.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to ensure IDs are strings
const ensureStringId = (id) => {
  return typeof id === 'string' ? id : String(id);
};

class RoadmapService {
  async createRoadmap(userId, roadmapData) {
    const roadmap = {
      ...roadmapData,
      userId,
      isTemplate: false,
    };
    return await roadmapRepository.create(roadmap);
  }

  async getRoadmaps(userId) {
    return await roadmapRepository.findAll(userId);
  }

  async getRoadmapById(id) {
    const roadmap = await roadmapRepository.findById(id);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }
    return roadmap;
  }

  async updateRoadmap(id, userId, roadmapData) {
    const roadmap = await roadmapRepository.findById(id);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }
    if (roadmap.userId !== userId) {
      throw new Error("Unauthorized to update this roadmap");
    }

    const updatedRoadmap = await roadmapRepository.update(id, roadmapData);
    return updatedRoadmap;
  }

  async deleteRoadmap(id, userId) {
    const roadmap = await roadmapRepository.findById(id);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }
    if (roadmap.userId !== userId) {
      throw new Error("Unauthorized to delete this roadmap");
    }

    return await roadmapRepository.delete(id);
  }

  async updateTopicStatus(roadmapId, topicId, userId, status) {
    try {
      console.log(`Service: Updating topic status. Roadmap=${roadmapId}, Topic=${topicId}, Status=${status}`);
      
      const roadmap = await roadmapRepository.findById(roadmapId);
      if (!roadmap) {
        throw new Error("Roadmap not found");
      }
      if (roadmap.userId !== userId) {
        throw new Error("Unauthorized to update this roadmap");
      }

      // Update the topic status
      const updatedTopic = await roadmapRepository.updateTopicStatus(
        roadmapId,
        topicId,
        status
      );

      // Calculate the new progress
      const progress = await roadmapRepository.calculateProgress(roadmapId);
      console.log(`Calculated new progress: ${progress}%`);

      // Use the dedicated method to update just the progress field
      await roadmapRepository.updateProgress(roadmapId, progress);

      return updatedTopic;
    } catch (error) {
      console.error('Error in updateTopicStatus service:', error);
      throw error;
    }
  }
}

export default new RoadmapService();
