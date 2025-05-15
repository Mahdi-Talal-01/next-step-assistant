const fs = require("fs");
const path = require("path");
const multer = require("multer");
const fileUploadService = require("../../services/FileUploadService");

// Mock dependencies
jest.mock("fs");
jest.mock("path");
jest.mock("multer");

describe("FileUploadService", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup path.join mock
    path.join.mockImplementation((...args) => args.join('/'));
    path.extname.mockImplementation((filename) => {
      const parts = filename.split('.');
      return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
    });
    
    // Mock fs functions
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    fs.unlinkSync.mockImplementation(() => {});
  });
  
});
