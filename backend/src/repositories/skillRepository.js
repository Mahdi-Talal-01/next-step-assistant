const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
class SkillRepository {

  // Skill CRUD operations
  async createSkill(data) {
    try {
      // Check if skill with same name already exists
      const existingSkill = await this.getSkillByName(data.name);
      if (existingSkill) {
        return existingSkill;
      }

      // Create new skill with a unique name if needed
      let skillName = data.name;
      let counter = 1;
      while (await this.getSkillByName(skillName)) {
        skillName = `${data.name} (${counter})`;
        counter++;
      }

      // Create new skill
      return await prisma.skill.create({
        data: {
          name: skillName,
          category: data.category || 'Technical',
          description: data.description || `Skill: ${skillName}`
        }
      });
    } catch (error) {
      console.error('Error creating skill:', error);
      throw new Error(error.message || 'Failed to create skill');
    }
  }
  async getSkillById(id) {
    return prisma.skill.findUnique({
      where: { id }
    });
  }
  async getSkillByName(name) {
    return prisma.skill.findUnique({
      where: { name }
    });
  }
  async getAllSkills() {
    return prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
  }
  async updateSkill(id, data) {
    return prisma.skill.update({
      where: { id },
      data
    });
  }
  async deleteSkill(id) {
    return prisma.skill.delete({
      where: { id }
    });
  }
   // User Skill operations
   async getUserSkill(userId, skillId) {
    return prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });
  }
  async addUserSkill(userId, skillId, level) {
    return prisma.userSkill.create({
      data: {
        userId,
        skillId,
        level
      }
    });
  }
  async getUserSkills(userId) {
    return prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true
      }
    });
  }
  async updateUserSkillLevel(userId, skillId, level) {
    return prisma.userSkill.update({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      },
      data: { level }
    });
  }
  async removeUserSkill(userId, skillId) {
    return prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });
  }
  // Job Skill operations
  async addJobSkill(jobId, skillId, required) {
    return prisma.jobSkill.create({
      data: {
        jobId,
        skillId,
        required
      }
    });
  }
  async getJobSkills(jobId) {
    return prisma.jobSkill.findMany({
      where: { jobId },
      include: {
        skill: true
      }
    });
  }
  async updateJobSkillRequirement(jobId, skillId, required) {
    return prisma.jobSkill.update({
      where: {
        jobId_skillId: {
          jobId,
          skillId
        }
      },
      data: { required }
    });
  }
  async removeJobSkill(jobId, skillId) {
    return prisma.jobSkill.delete({
      where: {
        jobId_skillId: {
          jobId,
          skillId
        }
      }
    });
  }
  async addRoadmapSkill(roadmapId, skillId, level) {
    return prisma.roadmapSkill.create({
      data: {
        roadmapId,
        skillId,
        level
      }
    });
  }
  async getRoadmapSkills(roadmapId) {
    return prisma.roadmapSkill.findMany({
      where: { roadmapId },
      include: {
        skill: true
      }
    });
  }
  async updateRoadmapSkillLevel(roadmapId, skillId, level) {
    return prisma.roadmapSkill.update({
      where: {
        roadmapId_skillId: {
          roadmapId,
          skillId
        }
      },
      data: { level }
    });
  }
  async removeRoadmapSkill(roadmapId, skillId) {
    return prisma.roadmapSkill.delete({
      where: {
        roadmapId_skillId: {
          roadmapId,
          skillId
        }
      }
    });
  }
   // Topic Skill operations
   async addTopicSkill(topicId, skillId, level) {
    return prisma.topicSkill.create({
      data: {
        topicId,
        skillId,
        level
      }
    });
  }
  async getTopicSkills(topicId) {
    return prisma.topicSkill.findMany({
      where: { topicId },
      include: {
        skill: true
      }
    });
  }
  async updateTopicSkillLevel(topicId, skillId, level) {
    return prisma.topicSkill.update({
      where: {
        topicId_skillId: {
          topicId,
          skillId
        }
      },
      data: { level }
    });
  }
  async removeTopicSkill(topicId, skillId) {
    return prisma.topicSkill.delete({
      where: {
        topicId_skillId: {
          topicId,
          skillId
        }
      }
    });
  }
  async getSkillsByCategory(category) {
    return prisma.skill.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
  }
  async getSkillsWithUserCount() {
    return prisma.skill.findMany({
      include: {
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        users: {
          _count: 'desc'
        }
      }
    });
  }
  async getSkillsWithJobCount() {
    return prisma.skill.findMany({
      include: {
        _count: {
          select: {
            jobs: true
          }
        }
      },
      orderBy: {
        jobs: {
          _count: 'desc'
        }
      }
    });
  }
   // Skill Analytics methods
   async getSkillGrowthTrends(skillId, months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return prisma.userSkill.groupBy({
      by: ['createdAt'],
      where: {
        skillId,
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        userId: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }
  async getAverageSalaryPerSkill() {
    const results = await prisma.jobSkill.findMany({
      select: {
        skillId: true,
        job: {
          select: {
            salary: true
          }
        }
      }
    });

    // Group and calculate average salary per skill
    const salaryBySkill = results.reduce((acc, curr) => {
      if (!acc[curr.skillId]) {
        acc[curr.skillId] = {
          total: 0,
          count: 0
        };
      }
      if (curr.job?.salary) {
        acc[curr.skillId].total += curr.job.salary;
        acc[curr.skillId].count += 1;
      }
      return acc;
    }, {});

    // Get the skills data
    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: Object.keys(salaryBySkill)
        }
      }
    });

    // Format the results
    return Object.entries(salaryBySkill).map(([skillId, data]) => ({
      skillId,
      averageSalary: data.count > 0 ? data.total / data.count : 0,
      skill: skills.find(s => s.id === skillId)
    }));
  }
  async getJobDemandPerSkill() {
    const results = await prisma.jobSkill.groupBy({
      by: ['skillId'],
      _count: {
        jobId: true
      },
      orderBy: {
        _count: {
          jobId: 'desc'
        }
      }
    });

    // Get the skills data separately
    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: results.map(r => r.skillId)
        }
      }
    });

    // Combine the results
    return results.map(result => ({
      ...result,
      skill: skills.find(s => s.id === result.skillId)
    }));
  }
  async getSkillGrowthRate(skillId) {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const [currentCount, previousCount] = await Promise.all([
      prisma.userSkill.count({
        where: {
          skillId,
          createdAt: {
            gte: threeMonthsAgo
          }
        }
      }),
      prisma.userSkill.count({
        where: {
          skillId,
          createdAt: {
            lt: threeMonthsAgo,
            gte: new Date(threeMonthsAgo.getTime() - (3 * 30 * 24 * 60 * 60 * 1000))
          }
        }
      })
    ]);

    return {
      currentCount,
      previousCount,
      growthRate: previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100
    };
  }
  async getSkillDemandTrends(skillId, months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return prisma.jobSkill.groupBy({
      by: ['createdAt'],
      where: {
        skillId,
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        jobId: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }
  async getSkillAnalytics(skillId) {
    const [
      growthRate,
      averageSalary,
      jobDemand,
      growthTrends,
      demandTrends
    ] = await Promise.all([
      this.getSkillGrowthRate(skillId),
      this.getAverageSalaryPerSkill().then(results => 
        results.find(r => r.skillId === skillId)
      ),
      this.getJobDemandPerSkill().then(results => 
        results.find(r => r.skillId === skillId)
      ),
      this.getSkillGrowthTrends(skillId),
      this.getSkillDemandTrends(skillId)
    ]);

    return {
      growthRate,
      averageSalary: averageSalary?._avg?.job?.salary || 0,
      jobDemand: jobDemand?._count?.jobId || 0,
      growthTrends,
      demandTrends
    };
  }
}
module.exports = new SkillRepository();