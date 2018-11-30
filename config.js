const conf = {
    "production": {
        "ports": {
            "http": 5000,
            "https": 5001
        }
    },
    "development": {
        "ports": {
            "http": 3000,
            "https": 3001
        }
    }
};

module.exports = typeof conf[process.env.NODE_ENV || ""] === "object" ? conf[process.env.NODE_ENV] : conf.development;