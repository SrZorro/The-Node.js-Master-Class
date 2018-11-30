const route = {
    get: (data, res) => {
        const responses = [
            "Howdy partner!",
            "Hello there.",
            "Wellcome!",
            "Bienvenido!"
        ];

        // Chose a random wellcome message
        res(200, responses[Math.floor(Math.random() * responses.length)]);
    }
};

module.exports = route;