const { PrismaClient } = require("@prisma/client");
const JobRepository = require("../../repositories/JobRepository");

// Mock the Prisma client
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    jobSkill: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaClient)),
    $queryRaw: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  };
});
// Get the mocked prisma client
const prisma = new PrismaClient();

describe("JobRepository", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  describe('createJob', () => {
    it('should create a new job with skills', async () => {
      // Setup test data
      const userId = 'user-1';
      const jobData = {
        company: 'Acme Inc',
        position: 'Software Engineer',
        status: 'Applied',
        skills: [
          { skillId: 'skill-1', required: true },
          { skillId: 'skill-2', required: false }
        ]
      };
      
      // Mock the response from prisma
      const mockCreatedJob = {
        id: 'job-1',
        userId,
        company: jobData.company,
        position: jobData.position,
        status: jobData.status,
        appliedDate: new Date(),
        lastUpdated: new Date(),
        stages: null,
        skills: [
          { 
            skillId: 'skill-1',
            required: true,
            skill: { id: 'skill-1', name: 'JavaScript' }
          },
          {
            skillId: 'skill-2',
            required: false,
            skill: { id: 'skill-2', name: 'React' }
          }
        ]
      };
      
      prisma.job.create.mockResolvedValue(mockCreatedJob);
      
      // Call the repository method
      const result = await JobRepository.createJob(userId, jobData);
      
      // Assertions
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.job.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          company: jobData.company,
          position: jobData.position,
          status: jobData.status,
          user: expect.objectContaining({
            connect: { id: userId }
          }),
          skills: expect.objectContaining({
            create: expect.arrayContaining([
              expect.objectContaining({ skillId: 'skill-1', required: true }),
              expect.objectContaining({ skillId: 'skill-2', required: false })
            ])
          })
        }),
        include: expect.any(Object)
      });
      
      expect(result).toEqual(expect.objectContaining({
        id: mockCreatedJob.id,
        company: mockCreatedJob.company,
        position: mockCreatedJob.position,
        skills: expect.arrayContaining([
          expect.objectContaining({ skillId: 'skill-1', required: true }),
          expect.objectContaining({ skillId: 'skill-2', required: false })
        ])
      }));
    });
    
    it('should create a job with stages if provided', async () => {
      // Setup test data
      const userId = 'user-1';
      const stages = [
        { name: 'Applied', date: '2023-01-01' },
        { name: 'Phone Screen', date: '2023-01-15' }
      ];
      const jobData = {
        company: 'Acme Inc',
        position: 'Software Engineer',
        status: 'Interview',
        stages,
        skills: []
      };
      
      // Mock the response from prisma
      const mockCreatedJob = {
        id: 'job-1',
        company: jobData.company,
        position: jobData.position,
        status: jobData.status,
        stages: JSON.stringify(stages),
        skills: []
      };
      
      prisma.job.create.mockResolvedValue(mockCreatedJob);
      
      // Call the repository method
      const result = await JobRepository.createJob(userId, jobData);
      
      // Assertions
      expect(prisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            stages: JSON.stringify(stages)
          })
        })
      );
      
      expect(result).toEqual(expect.objectContaining({
        stages
      }));
    });
    
    it('should throw an error if job creation fails', async () => {
      // Setup test data
      const userId = 'user-1';
      const jobData = {
        company: 'Acme Inc',
        position: 'Software Engineer',
        status: 'Applied',
        skills: []
      };
      
      // Mock the prisma client to throw an error
      const error = new Error('Database error');
      prisma.job.create.mockRejectedValue(error);
      
      // Call the repository method and expect it to throw
      await expect(JobRepository.createJob(userId, jobData)).rejects.toThrow(error);
    });
  });
  describe('getJobsByUserId', () => {
    it('should return all jobs for a user', async () => {
      // Setup test data
      const userId = 'user-1';
      const mockJobs = [
        {
          id: 'job-1',
          company: 'Acme Inc',
          position: 'Software Engineer',
          status: 'Applied',
          userId,
          skills: [
            { 
              skillId: 'skill-1',
              required: true,
              skill: { id: 'skill-1', name: 'JavaScript' }
            }
          ]
        },
        {
          id: 'job-2',
          company: 'Beta Corp',
          position: 'Full Stack Developer',
          status: 'Interview',
          userId,
          skills: []
        }
      ];
      
      // Mock the prisma response
      prisma.job.findMany.mockResolvedValue(mockJobs);
      
      // Call the repository method
      const result = await JobRepository.getJobsByUserId(userId);
      
      // Assertions
      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { lastUpdated: 'desc' },
        include: expect.any(Object)
      });
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('job-1');
      expect(result[1].id).toBe('job-2');
      
      // Check skills are mapped correctly
      expect(result[0].skills).toEqual([
        expect.objectContaining({
          skillId: 'skill-1',
          required: true,
          skill: expect.objectContaining({ id: 'skill-1', name: 'JavaScript' })
        })
      ]);
    });
    
    it('should throw an error if fetching jobs fails', async () => {
      // Setup
      const userId = 'user-1';
      const error = new Error('Database error');
      prisma.job.findMany.mockRejectedValue(error);
      
      // Call and assert
      await expect(JobRepository.getJobsByUserId(userId)).rejects.toThrow(error);
    });
  });
});
