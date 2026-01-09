const { app } = require('@azure/functions');

// Import all your functions
require('./functions/UpdateCounter.js');

// Export the app for Azure Functions
module.exports = app;