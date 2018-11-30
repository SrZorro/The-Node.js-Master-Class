const fs = require("fs");

const routes = {};

fs.readdirSync(__dirname).forEach(file => {
    // If file is index.js, its the route handler file (self), don't return it as a route
    if (file === "index.js") return;

    // Require the route, aka the file
    const route = require(`./${file}`);

    // Check if route.path its a string or regex, if not, set it to the name of the file, and delete .js from the end
    if (typeof route.path !== "string" || !(route.path instanceof RegExp)) route.path = file.replace(/\.js$/, "");

    // add route to routes
    routes[route.path] = route;
});

module.exports = routes;