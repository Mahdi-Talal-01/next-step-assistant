const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const userController = require('../../controllers/UserController');

// Mock UserController methods
jest.mock('../../controllers/UserController');
describe('User Routes', () => {
  let app;
  
  beforeEach(() => {
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
    
    // Reset controller mocks
    jest.resetAllMocks();
  });
});