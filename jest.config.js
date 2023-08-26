
const config = {
    verbose: true,
    collectCoverageFrom: ['./routes/*.js'],
    coverageThreshold: {
        global: {
            // functions: 100,
            // lines: 80,
            // statements: -10,
        },
    }
}


module.exports = config;
