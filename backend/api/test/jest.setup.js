jest.setTimeout(10000);

// Set test environment variables
process.env.COSMOS_CONNECTION_STRING = 'AccountEndpoint=https://test.documents.azure.com:443/;AccountKey=dGVzdGtleQ==;';
process.env.COSMOS_DATABASE_NAME = 'testdb';
process.env.COSMOS_CONTAINER_NAME = 'testcontainer';
