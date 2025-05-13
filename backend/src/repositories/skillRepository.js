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
}
module.exports = new SkillRepository();