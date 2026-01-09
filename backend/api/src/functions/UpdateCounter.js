const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('UpdateCounter', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'counter',
    handler: async (request, context) => {
        context.log('UpdateCounter function triggered');
        
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: ''
            };
        }
        
        try {
            // Get Cosmos DB configuration from environment
            const connectionString = process.env.COSMOS_CONNECTION_STRING;
            const databaseId = process.env.COSMOS_DATABASE_NAME;
            const containerId = process.env.COSMOS_CONTAINER_NAME;
            
            context.log(`Testing Cosmos DB connection to: ${databaseId}.${containerId}`);
            
            if (!connectionString) {
                throw new Error('COSMOS_CONNECTION_STRING is not set in local.settings.json');
            }
            
            // Initialize Cosmos Client
            const client = new CosmosClient(connectionString);
            const counterId = 'resumeCounter';
            
            // Try to connect and increment counter
            let count;
            let lastUpdated;
            
            try {
                // First, ensure database exists
                const { database } = await client.databases.createIfNotExists({
                    id: databaseId
                });
                
                context.log(`Database '${databaseId}' is ready`);
                
                // Ensure container exists
                const { container } = await database.containers.createIfNotExists({
                    id: containerId,
                    partitionKey: {
                        paths: ["/id"]
                    }
                });
                
                context.log(`Container '${containerId}' is ready`);
                
                try {
                    // Try to read existing counter
                    const { resource: counter } = await container
                        .item(counterId, counterId)
                        .read();
                    
                    if (counter && typeof counter.count === 'number') {
                        // Increment existing counter
                        count = counter.count + 1;
                        counter.count = count;
                        counter.lastUpdated = new Date().toISOString();
                        
                        await container.item(counterId, counterId).replace(counter);
                        lastUpdated = counter.lastUpdated;
                        
                        context.log(`Updated existing counter to: ${count}`);
                    } else {
                        throw new Error('Counter document exists but has no count property');
                    }
                    
                } catch (readError) {
                    // Counter doesn't exist, create new one
                    count = 1;
                    lastUpdated = new Date().toISOString();
                    const newCounter = {
                        id: counterId,
                        count: count,
                        lastUpdated: lastUpdated,
                        createdAt: lastUpdated,
                        type: 'visitCounter',
                        description: 'Azure Resume Visit Counter'
                    };
                    
                    await container.items.create(newCounter);
                    context.log(`Created new counter: ${count}`);
                }
                
                return {
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: true,
                        count: count,
                        lastUpdated: lastUpdated,
                        message: `Counter: ${count} (Connected to Azure Cosmos DB)`,
                        source: 'Azure Cosmos DB',
                        database: databaseId,
                        container: containerId
                    })
                };
                
            } catch (cosmosError) {
                context.log.error('Cosmos DB error:', cosmosError);
                
                // Provide helpful error message
                let errorMessage = `Cosmos DB Error: ${cosmosError.message}`;
                
                if (cosmosError.code === 'ECONNREFUSED') {
                    errorMessage = 'Cannot connect to Cosmos DB. Check: 1) Internet connection, 2) Firewall settings in Azure Portal, 3) Connection string';
                } else if (cosmosError.code === 'Unauthorized') {
                    errorMessage = 'Unauthorized. Check your Cosmos DB AccountKey in the connection string';
                }
                
                throw new Error(errorMessage);
            }
            
        } catch (error) {
            context.log.error('Function error:', error);
            
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: error.message,
                    count: 0,
                    message: 'Failed to connect to Cosmos DB',
                    note: 'Check your local.settings.json and Azure Cosmos DB firewall settings',
                    troubleshooting: [
                        '1. Verify COSMOS_CONNECTION_STRING in local.settings.json',
                        '2. Check Cosmos DB firewall allows your IP',
                        '3. Ensure Cosmos DB account is active',
                        '4. Test connection with: node test-connection.js'
                    ]
                })
            };
        }
    }
});