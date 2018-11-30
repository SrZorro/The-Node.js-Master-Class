const route = {
    internal: true,
    all: (data, res) => {
        res(501, { "err": "Not implemented." });
    }
};

module.exports = route;