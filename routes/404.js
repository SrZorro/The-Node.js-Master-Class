const route = {
    internal: true,
    all: (data, res) => {
        res(404, { "err": "Path not found." });
    }
};

module.exports = route;