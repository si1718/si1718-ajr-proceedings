exports.config = {
    seleniumAddress: 'http://localhost:9515',
    specs: ['T01-LoadProceedings.js'],
    capabilities: {
        'browserName': 'phantomjs'
    }
};