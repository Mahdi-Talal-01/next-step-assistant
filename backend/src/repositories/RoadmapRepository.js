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
}
module.exports = new RoadmapRepository(); 