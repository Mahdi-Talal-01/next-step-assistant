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
}
module.exports = new RoadmapRepository(); 