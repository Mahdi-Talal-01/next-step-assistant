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
}
module.exports = new RoadmapRepository(); 