const { app } = require('@azure/functions');

// Import all your functions
require('./functions/UpdateCounter.js');
require('./functions/SendContactEmail.js');

// Export the app for Azure Functions
module.exports = app;