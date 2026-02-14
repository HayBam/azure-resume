// Simple test to verify Jest works
describe('Basic Tests', () => {
    test('Jest is working', () => {
        expect(true).toBe(true);
    });
    
    test('Environment is set', () => {
        expect(process.env.NODE_ENV).toBeDefined();
    });
});