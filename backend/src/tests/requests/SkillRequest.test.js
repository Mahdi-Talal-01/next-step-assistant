const {
  validateSkill,
  validateUserSkill,
  validateJobSkill,
  validateRoadmapSkill,
  validateTopicSkill,
} = require("../../requests/skillRequest");

describe("Skill Request Validators", () => {
  // Setup common mock objects
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });
});
