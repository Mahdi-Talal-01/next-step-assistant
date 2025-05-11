import request from '../commons/request';

class RoadmapService {
    async getAllRoadmaps(params = {}) {
        const { page = 1, limit = 10, search, sort, filter } = params;
        const queryParams = new URLSearchParams();
        
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (sort) queryParams.append('sort', sort);
        if (filter) queryParams.append('filter', JSON.stringify(filter));

        return request.get(`/roadmaps?${queryParams.toString()}`);
    }
 
}

export default new RoadmapService(); 