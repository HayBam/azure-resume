// test/integration/cosmos.integration.test.js
const { CosmosClient } = require('@azure/cosmos');

// Only run if env var is set
const runIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true';

describe('Cosmos DB Integration Tests', () => {
    let client;
    let database;
    let container;

    beforeAll(async () => {
        if (!runIntegrationTests) {
            return;
        }

        // Use test Cosmos DB or emulator
        const connectionString = process.env.TEST_COSMOS_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('TEST_COSMOS_CONNECTION_STRING not set');
        }

        client = new CosmosClient(connectionString);
        database = client.database('azureresume-test');
        container = database.container('counter-test');
    });

    test('should connect to Cosmos DB', async () => {
        if (!runIntegrationTests) {
            return;
        }

        const { resource: databases } = await client.databases.readAll().fetchAll();
        expect(databases).toBeDefined();
    });

    test('should read/write counter', async () => {
        if (!runIntegrationTests) {
            return;
        }

        const testCounter = {
            id: 'test-counter',
            count: 1,
            lastUpdated: new Date().toISOString()
        };

        // Write
        const { resource: created } = await container.items.create(testCounter);
        expect(created.id).toBe('test-counter');

        // Read
        const { resource: read } = await container.item('test-counter', 'test-counter').read();
        expect(read.count).toBe(1);

        // Clean up
        await container.item('test-counter', 'test-counter').delete();
    });
});