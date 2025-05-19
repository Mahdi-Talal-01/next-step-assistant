import request from "../commons/request";

// Helper to ensure IDs are strings
const ensureStringId = (id) => {
  return typeof id === "string" ? id : String(id);
};

class RoadmapService {
  async getAllRoadmaps() {
    // No query parameters as we fetch all roadmaps and filter on the client
    return request.get(`/roadmaps`);
  }

  async getRoadmapById(id) {
    return request.get(`/roadmaps/${ensureStringId(id)}`);
  }

  async createRoadmap(roadmapData) {
    // Process roadmap data to ensure all IDs are strings and remove any client-side IDs
    // that might conflict with backend's UUID generation
    const processedData = {
      ...roadmapData,
      topics: roadmapData.topics.map((topic) => {
        // Prepare each topic correctly for the backend
        const { id: topicId, ...topicData } = topic;

        return {
          ...topicData,
          resources: (topic.resources || []).map((resource) => {
            // Prepare each resource correctly for the backend
            const { id: resourceId, ...resourceData } = resource;
            return resourceData;
          }),
        };
      }),
    };
    return request.post("/roadmaps", processedData);
  }

  async updateRoadmap(id, roadmapData) {
    // Process roadmap data to ensure format matches what backend expects
    // Remove client-side IDs that might conflict with backend's expectations
    const processedData = {
      ...roadmapData,
      topics: roadmapData.topics.map((topic) => {
        // Prepare each topic correctly for the backend
        const { id: topicId, ...topicData } = topic;

        return {
          ...topicData,
          resources: (topic.resources || []).map((resource) => {
            // Prepare each resource correctly for the backend
            const { id: resourceId, ...resourceData } = resource;
            return resourceData;
          }),
        };
      }),
    };
    return request.put(`/roadmaps/${ensureStringId(id)}`, processedData);
  }

  async deleteRoadmap(id) {
    const stringId = ensureStringId(id);
    console.log(
      `Sending DELETE request to backend for roadmap ID: ${stringId}`
    );
    try {
      const response = await request.delete(`/roadmaps/${stringId}`);
      // Make sure we return a properly structured response even if the backend doesn't
      if (!response || typeof response !== "object") {
        return {
          success: true,
          message: "Roadmap deleted successfully",
          data: null,
        };
      }

      // If the response doesn't have a success flag, assume success
      if (response.success === undefined) {
        return {
          success: true,
          message: "Roadmap deleted successfully",
          data: response,
        };
      }

      return response;
    } catch (error) {
      console.error(
        `Error in deleteRoadmap service for ID ${stringId}:`,
        error
      );
      // Ensure we return a well-structured error response
      return {
        success: false,
        message: error.message || "Failed to delete roadmap",
        data: null,
      };
    }
  }

  async updateTopicStatus(roadmapId, topicId, status) {
    const url = `/roadmaps/${ensureStringId(roadmapId)}/topics/${ensureStringId(
      topicId
    )}/status`;
    const data = { status };

    try {
      return request.patch(url, data);
    } catch (error) {
      console.warn("PATCH method failed, falling back to POST method");
      // Some browsers or configurations might have issues with PATCH
      // Adding a fallback to use POST with the same endpoint
      return request.post(url, data);
    }
  }
}

export default new RoadmapService();
