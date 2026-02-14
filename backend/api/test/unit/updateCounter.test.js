// test/unit/updateCounter.test.js
const { MockCosmosClient } = require('../helpers/cosmos-mock');

// Mock environment variables
process.env.COSMOS_CONNECTION_STRING = 'mock-connection-string';
process.env.COSMOS_DATABASE_NAME = 'testdb';
process.env.COSMOS_CONTAINER_NAME = 'testcontainer';

// Mock the CosmosClient
jest.mock('@azure/cosmos', () => ({
    CosmosClient: jest.fn().mockImplementation(() => new MockCosmosClient())
}));

// Import the function to test
const { app } = require('../../src/functions/UpdateCounter');

// Mock context object
const createMockContext = () => ({
    log: jest.fn(),
    log: { error: jest.fn(), warn: jest.fn() },
    res: null,
    done: jest.fn()
});

describe('UpdateCounter Function', () => {
    let mockContext;
    let mockClient;

    beforeEach(() => {
        jest.clearAllMocks();
        mockContext = createMockContext();
        mockClient = new MockCosmosClient();
    });

    // Test 1: CORS preflight
    test('should handle OPTIONS request for CORS', async () => {
        const mockRequest = {
            method: 'OPTIONS',
            headers: {
                'origin': 'http://localhost:5500'
            }
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(200);
        expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    });

    // Test 2: POST request should return success
    test('should handle POST request', async () => {
        const mockRequest = {
            method: 'POST',
            headers: {
                'origin': 'http://localhost:5500',
                'content-type': 'application/json'
            },
            body: JSON.stringify({ test: true })
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.count).toBeDefined();
    });
});