// test/jest.setup.js
jest.setTimeout(30000); // 30 second timeout

// Mock console methods to reduce noise during tests
global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});