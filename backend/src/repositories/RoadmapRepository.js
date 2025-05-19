import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to ensure IDs are strings
const ensureStringId = (id) => {
    return typeof id === 'string' ? id : String(id);
};

class RoadmapRepository {
    async create(data) {
        // Restructure data to match Prisma's expected format for nested creates
        const processedData = {
            ...data,
            topics: {
                create: data.topics.map(topic => {
                    // Remove any client-generated IDs from topic and resources
                    // Prisma will create new UUIDs
                    const { id: topicId, resources, ...topicData } = topic;
                    return {
                        ...topicData,
                        resources: {
                            create: (resources || []).map(resource => {
                                const { id: resourceId, ...resourceData } = resource;
                                return resourceData;
                            })
                        }
                    };
                })
            }
        };

        return await prisma.roadmap.create({
            data: processedData,
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
            where: { id: ensureStringId(id) },
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
            where: { roadmapId: ensureStringId(id) }
        });

        // Restructure data to match Prisma's expected format for nested creates
        const processedData = {
            ...data,
            topics: {
                create: data.topics.map(topic => {
                    // Remove any client-generated IDs from topic and resources
                    const { id: topicId, resources, ...topicData } = topic;
                    return {
                        ...topicData,
                        resources: {
                            create: (resources || []).map(resource => {
                                const { id: resourceId, ...resourceData } = resource;
                                return resourceData;
                            })
                        }
                    };
                })
            }
        };

        // Then update the roadmap with new data
        return await prisma.roadmap.update({
            where: { id: ensureStringId(id) },
            data: processedData,
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
            where: { id: ensureStringId(id) }
        });
    }

    async updateTopicStatus(roadmapId, topicId, status) {
        // First check if the topic exists and belongs to this roadmap
        const topic = await prisma.topic.findFirst({
            where: {
                id: ensureStringId(topicId),
                roadmapId: ensureStringId(roadmapId)
            }
        });

        if (!topic) {
            throw new Error(`Topic not found with ID: ${topicId} in roadmap: ${roadmapId}`);
        }

        try {
            // Update the topic status - using just the ID since it's the primary key
            return await prisma.topic.update({
                where: {
                    id: ensureStringId(topicId)
                },
                data: { status }
            });
        } catch (error) {
            console.error('Error updating topic status:', error);
            throw new Error(`Failed to update topic status: ${error.message}`);
        }
    }

    async calculateProgress(roadmapId) {
        const topics = await prisma.topic.findMany({
            where: { roadmapId: ensureStringId(roadmapId) }
        });

        if (topics.length === 0) return 0;

        const completedTopics = topics.filter(topic => topic.status === 'completed').length;
        return Math.round((completedTopics / topics.length) * 100);
    }

    async updateProgress(id, progress) {
        try {
            // Update only the progress field
            return await prisma.roadmap.update({
                where: { id: ensureStringId(id) },
                data: { progress }
            });
        } catch (error) {
            console.error('Error updating roadmap progress:', error);
            throw new Error(`Failed to update roadmap progress: ${error.message}`);
        }
    }
}

export default new RoadmapRepository(); 