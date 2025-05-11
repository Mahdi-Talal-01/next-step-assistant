import request from "../commons/request";

class RoadmapService {
  async getAllRoadmaps(params = {}) {
    const { page = 1, limit = 10, search, sort, filter } = params;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (sort) queryParams.append("sort", sort);
    if (filter) queryParams.append("filter", JSON.stringify(filter));

    return request.get(`/roadmaps?${queryParams.toString()}`);
  }

  async getRoadmapById(id) {
    return request.get(`/roadmaps/${id}`);
  }

  async createRoadmap(roadmapData) {
    return request.post("/roadmaps", roadmapData);
  }

  async updateRoadmap(id, roadmapData) {
    return request.put(`/roadmaps/${id}`, roadmapData);
  }

  async deleteRoadmap(id) {
    return request.delete(`/roadmaps/${id}`);
  }

  async updateTopicStatus(roadmapId, topicId, status) {
    return request.patch(`/roadmaps/${roadmapId}/topics/${topicId}/status`, {
      status,
    });
  }
}

export default new RoadmapService();
