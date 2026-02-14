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
const { CosmosClient } = require('@azure/cosmos');

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
    let originalEnv;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        mockContext = createMockContext();
        mockClient = new MockCosmosClient();
        
        // Save original env
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        // Restore original env
        process.env = { ...originalEnv };
    });

    // Test 1: CORS preflight
    test('should handle OPTIONS request for CORS', async () => {
        const { app } = require('../../src/functions/UpdateCounter');
        
        const mockRequest = {
            method: 'OPTIONS',
            headers: {
                'origin': 'http://localhost:5500'
            }
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(200);
        expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
        expect(response.headers['Access-Control-Allow-Methods']).toBe('GET, POST, OPTIONS');
    });

    // Test 2: Increment existing counter
    test('should increment existing counter', async () => {
        const { app } = require('../../src/functions/UpdateCounter');
        
        // Setup mock data
        const container = mockClient.database('testdb').container('testcontainer');
        const existingCounter = {
            id: 'resumeCounter',
            count: 42,
            lastUpdated: new Date().toISOString()
        };
        container._setMockData('resumeCounter', existingCounter);

        const mockRequest = {
            method: 'POST',
            headers: {
                'origin': 'http://localhost:5500'
            },
            body: JSON.stringify({
                page: '/test',
                timestamp: new Date().toISOString()
            })
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.count).toBe(43); // 42 + 1
        expect(body.source).toBe('Azure Cosmos DB');
    });

    // Test 3: Create new counter if doesn't exist
    test('should create new counter if none exists', async () => {
        const { app } = require('../../src/functions/UpdateCounter');
        
        const mockRequest = {
            method: 'POST',
            headers: {
                'origin': 'http://localhost:5500'
            },
            body: JSON.stringify({
                page: '/test',
                timestamp: new Date().toISOString()
            })
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.count).toBe(1);
    });

    // Test 4: Handle missing environment variables
    test('should handle missing Cosmos DB connection string', async () => {
        delete process.env.COSMOS_CONNECTION_STRING;
        
        const { app } = require('../../src/functions/UpdateCounter');
        
        const mockRequest = {
            method: 'POST',
            headers: {
                'origin': 'http://localhost:5500'
            },
            body: JSON.stringify({})
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(500);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(false);
        expect(body.error).toContain('COSMOS_CONNECTION_STRING not configured');
    });

    // Test 5: Test with different pages
    test('should handle different page paths', async () => {
        const { app } = require('../../src/functions/UpdateCounter');
        
        const testPages = ['/', '/resume.html', '/projects.html'];
        
        for (const page of testPages) {
            const mockRequest = {
                method: 'POST',
                headers: {
                    'origin': 'http://localhost:5500'
                },
                body: JSON.stringify({
                    page: page,
                    timestamp: new Date().toISOString()
                })
            };

            const response = await app.http.handler(mockRequest, mockContext);
            
            expect(response.status).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(true);
        }
    });

    // Test 6: GET request handling
    test('should handle GET requests', async () => {
        const { app } = require('../../src/functions/UpdateCounter');
        
        const mockRequest = {
            method: 'GET',
            headers: {
                'origin': 'http://localhost:5500'
            }
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        // Your function should handle GET (maybe return current count)
        // Adjust expectation based on your implementation
        expect(response.status).toBe(200);
    });

    // Test 7: Database error handling
    test('should handle database errors gracefully', async () => {
        const { app } = require('../../src/functions/UpdateCounter');
        
        // Force an error by making the container throw
        jest.spyOn(mockClient.database('testdb'), 'container').mockImplementation(() => {
            throw new Error('Database connection failed');
        });

        const mockRequest = {
            method: 'POST',
            headers: {
                'origin': 'http://localhost:5500'
            },
            body: JSON.stringify({})
        };

        const response = await app.http.handler(mockRequest, mockContext);
        
        expect(response.status).toBe(500);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(false);
    });
});