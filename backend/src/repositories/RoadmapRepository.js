const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RoadmapRepository {
    async create(data) {
        return await prisma.roadmap.create({
            data: {
                ...data,
                topics: {
                    create: data.topics.map(topic => ({
                        ...topic,
                        resources: {
                            create: topic.resources || []
                        }
                    }))
                }
            },
            include: {
                topics: {
                    include: {
                        resources: true
                    }
                }
            }
        });
    }

    async findAll(userId) {
        return await prisma.roadmap.findMany({
            where: {
                OR: [
                    { userId },
                    { isTemplate: true }
                ]
            },
            include: {
                topics: {
                    include: {
                        resources: true
                    }
                }
            }
        });
    }

    async findById(id) {
        return await prisma.roadmap.findUnique({
            where: { id },
            include: {
                topics: {
                    include: {
                        resources: true
                    }
                }
            }
        });
    }

    async update(id, data) {
        // First delete existing topics and resources
        await prisma.topic.deleteMany({
            where: { roadmapId: id }
        });

        // Then update the roadmap with new data
        return await prisma.roadmap.update({
            where: { id },
            data: {
                ...data,
                topics: {
                    create: data.topics.map(topic => ({
                        ...topic,
                        resources: {
                            create: topic.resources || []
                        }
                    }))
                }
            },
            include: {
                topics: {
                    include: {
                        resources: true
                    }
                }
            }
        });
    }

    async delete(id) {
        return await prisma.roadmap.delete({
            where: { id }
        });
    }

    async updateTopicStatus(roadmapId, topicId, status) {
        // First check if the topic exists
        const topic = await prisma.topic.findFirst({
            where: {
                id: topicId,
                roadmapId: roadmapId
            }
        });

        if (!topic) {
            throw new Error(`Topic not found with ID: ${topicId} in roadmap: ${roadmapId}`);
        }

        return await prisma.topic.update({
            where: {
                id: topicId,
                roadmapId: roadmapId
            },
            data: { status }
        });
    }

    async calculateProgress(roadmapId) {
        const topics = await prisma.topic.findMany({
            where: { roadmapId }
        });

        if (topics.length === 0) return 0;

        const completedTopics = topics.filter(topic => topic.status === 'completed').length;
        return Math.round((completedTopics / topics.length) * 100);
    }
}

module.exports = new RoadmapRepository(); 