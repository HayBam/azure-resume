// test/helpers/cosmos-mock.js
class MockCosmosContainer {
    constructor() {
        this.items = new Map();
        this.counter = null;
    }

    async item(id, partitionKey) {
        return {
            read: async () => {
                const item = this.items.get(id);
                if (!item) {
                    return { 
                        resource: null,
                        statusCode: 404 
                    };
                }
                return { 
                    resource: item,
                    statusCode: 200 
                };
            },
            replace: async (updatedItem) => {
                this.items.set(id, updatedItem);
                return { 
                    resource: updatedItem,
                    statusCode: 200 
                };
            }
        };
    }

    async items = {
        create: async (newItem) => {
            this.items.set(newItem.id, newItem);
            return { 
                resource: newItem,
                statusCode: 201 
            };
        }
    };

    async query(querySpec) {
        // Mock query for count
        if (querySpec.query.includes('COUNT')) {
            return {
                fetchAll: async () => ({
                    resources: [this.items.size]
                })
            };
        }
        return {
            fetchAll: async () => ({
                resources: Array.from(this.items.values())
            })
        };
    }

    // Helper to set mock data
    _setMockData(id, data) {
        this.items.set(id, data);
        if (id === 'resumeCounter') {
            this.counter = data;
        }
    }

    // Helper to clear mock data
    _clear() {
        this.items.clear();
        this.counter = null;
    }
}

class MockCosmosDatabase {
    constructor() {
        this.containers = new Map();
        this._currentContainer = null;
    }

    container(id) {
        if (!this.containers.has(id)) {
            this.containers.set(id, new MockCosmosContainer());
        }
        this._currentContainer = this.containers.get(id);
        return this._currentContainer;
    }
}

class MockCosmosClient {
    constructor() {
        this.databases = new Map();
    }

    database(id) {
        if (!this.databases.has(id)) {
            this.databases.set(id, new MockCosmosDatabase());
        }
        return this.databases.get(id);
    }

    // Helper to get database
    _getDatabase(id) {
        return this.databases.get(id);
    }
}

module.exports = {
    MockCosmosClient,
    MockCosmosDatabase,
    MockCosmosContainer
};