const { CosmosClient } = require('@azure/cosmos');

// Mock @azure/cosmos before importing the handler
jest.mock('@azure/cosmos');

// Mock @azure/functions so the require in UpdateCounter.js doesn't fail
jest.mock('@azure/functions', () => ({
    app: { http: jest.fn() }
}));

const { updateCounterHandler } = require('../../src/functions/UpdateCounter');

function createMockContext() {
    const logFn = jest.fn();
    logFn.error = jest.fn();
    logFn.warn = jest.fn();
    return { log: logFn };
}

// Helper to build the Cosmos mock chain
function setupCosmosMock({ readResult, readThrows, replaceResult, createResult } = {}) {
    const mockReplace = jest.fn().mockResolvedValue(replaceResult || {});
    const mockRead = readThrows
        ? jest.fn().mockRejectedValue(readThrows)
        : jest.fn().mockResolvedValue({ resource: readResult });

    const mockItem = jest.fn().mockReturnValue({
        read: mockRead,
        replace: mockReplace,
    });

    const mockCreate = jest.fn().mockResolvedValue(createResult || {});

    const mockContainer = {
        item: mockItem,
        items: { create: mockCreate },
    };

    const mockContainersCreateIfNotExists = jest.fn().mockResolvedValue({ container: mockContainer });

    const mockDatabase = {
        containers: { createIfNotExists: mockContainersCreateIfNotExists },
    };

    const mockDatabasesCreateIfNotExists = jest.fn().mockResolvedValue({ database: mockDatabase });

    CosmosClient.mockImplementation(() => ({
        databases: { createIfNotExists: mockDatabasesCreateIfNotExists },
    }));

    return { mockItem, mockRead, mockReplace, mockCreate, mockContainer };
}

describe('UpdateCounter Function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ---- CORS preflight ----
    describe('CORS preflight (OPTIONS)', () => {
        test('returns 200 with CORS headers', async () => {
            const request = { method: 'OPTIONS' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(200);
            expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
            expect(response.headers['Access-Control-Allow-Methods']).toContain('GET');
            expect(response.headers['Access-Control-Allow-Methods']).toContain('POST');
            expect(response.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
        });

        test('does not call Cosmos DB', async () => {
            const request = { method: 'OPTIONS' };
            const context = createMockContext();

            await updateCounterHandler(request, context);

            expect(CosmosClient).not.toHaveBeenCalled();
        });
    });

    // ---- Increment existing counter ----
    describe('GET/POST with existing counter', () => {
        test('increments the counter and returns new value', async () => {
            const { mockReplace } = setupCosmosMock({
                readResult: { id: 'resumeCounter', count: 41, lastUpdated: '2025-01-01T00:00:00Z' },
            });

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(true);
            expect(body.count).toBe(42);
            expect(mockReplace).toHaveBeenCalledTimes(1);
        });

        test('returns CORS header on success response', async () => {
            setupCosmosMock({
                readResult: { id: 'resumeCounter', count: 10 },
            });

            const request = { method: 'POST' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
            expect(response.headers['Content-Type']).toBe('application/json');
        });

        test('includes database and container info in response', async () => {
            setupCosmosMock({
                readResult: { id: 'resumeCounter', count: 5 },
            });

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);
            const body = JSON.parse(response.body);

            expect(body.database).toBe('testdb');
            expect(body.container).toBe('testcontainer');
            expect(body.source).toBe('Azure Cosmos DB');
        });
    });

    // ---- Create new counter ----
    describe('GET/POST when counter does not exist', () => {
        test('creates counter starting at 1', async () => {
            const { mockCreate } = setupCosmosMock({
                readThrows: new Error('Not found'),
            });

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(true);
            expect(body.count).toBe(1);
            expect(mockCreate).toHaveBeenCalledTimes(1);

            const createdDoc = mockCreate.mock.calls[0][0];
            expect(createdDoc.id).toBe('resumeCounter');
            expect(createdDoc.count).toBe(1);
            expect(createdDoc.type).toBe('visitCounter');
        });
    });

    // ---- Counter with invalid data ----
    describe('counter document exists but has no count property', () => {
        test('creates a new counter when count property is missing', async () => {
            const { mockCreate } = setupCosmosMock({
                readResult: { id: 'resumeCounter' }, // no count property
            });

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.count).toBe(1);
            expect(mockCreate).toHaveBeenCalledTimes(1);
        });
    });

    // ---- Missing connection string ----
    describe('missing COSMOS_CONNECTION_STRING', () => {
        test('returns 500 with descriptive error', async () => {
            const original = process.env.COSMOS_CONNECTION_STRING;
            delete process.env.COSMOS_CONNECTION_STRING;

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(500);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(false);
            expect(body.error).toContain('COSMOS_CONNECTION_STRING');

            process.env.COSMOS_CONNECTION_STRING = original;
        });
    });

    // ---- Cosmos DB connection errors ----
    describe('Cosmos DB errors', () => {
        test('returns 500 on ECONNREFUSED', async () => {
            const connError = new Error('connection refused');
            connError.code = 'ECONNREFUSED';

            CosmosClient.mockImplementation(() => ({
                databases: {
                    createIfNotExists: jest.fn().mockRejectedValue(connError),
                },
            }));

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(500);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(false);
            expect(body.error).toContain('Cannot connect to Cosmos DB');
        });

        test('returns 500 on Unauthorized', async () => {
            const authError = new Error('unauthorized');
            authError.code = 'Unauthorized';

            CosmosClient.mockImplementation(() => ({
                databases: {
                    createIfNotExists: jest.fn().mockRejectedValue(authError),
                },
            }));

            const request = { method: 'GET' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(500);
            const body = JSON.parse(response.body);
            expect(body.error).toContain('Unauthorized');
        });

        test('returns 500 with troubleshooting steps on generic error', async () => {
            CosmosClient.mockImplementation(() => ({
                databases: {
                    createIfNotExists: jest.fn().mockRejectedValue(new Error('something broke')),
                },
            }));

            const request = { method: 'POST' };
            const context = createMockContext();

            const response = await updateCounterHandler(request, context);

            expect(response.status).toBe(500);
            const body = JSON.parse(response.body);
            expect(body.troubleshooting).toBeDefined();
            expect(body.troubleshooting.length).toBeGreaterThan(0);
        });
    });
});
