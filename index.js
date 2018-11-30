const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;
const stringDecoder = new StringDecoder();
const conf = require("./config");
const routes = require("./routes");

const log = console.log;

// Loop the two types of posible servers...
for (const [protoName, proto] of Object.entries({ http, https })) {
    // Arguments that we will pass to the server
    const serverArgs = [];

    // If proto is https, first parameter will be the certs
    if (protoName === "https") serverArgs.push({
        "key": fs.readFileSync("./certs/key.pem"),
        "cert": fs.readFileSync("./certs/cert.pem"),
    });

    // Add the route handler where the routes will be resolved and handled
    serverArgs.push(routeHandler);

    // Create the server for this protocol with the arguments
    const server = proto.createServer(...serverArgs);

    // And finaly listen this protocol in the required server
    server.listen(conf.ports[protoName], () => {
        log(`Listening in port ${conf.ports[protoName]} for protocol ${protoName}.`);
    });
}

/**
 * Handle routes for the http/s server.
 * @param {Object} req http/s request object.
 * @param {Object} res http/s response object. 
 */
function routeHandler(req, res) {
    // Get url and queries
    const parsedUrl = url.parse(req.url, true);
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");

    let body = "";
    req.on("data", buffer => body += stringDecoder.write(buffer));

    req.on("end", () => {
        body += stringDecoder.end();

        // debug incoming request
        log(`Request <- Method: ${req.method} path: /${trimmedPath} payload: ${body}`);

        // Data to send to the route middleware
        const data = {
            parsedUrl,
            headers: req.headers,
            payload: body
        };

        /**
         * When route its finished, call this method to finish the request.
         * @param {number} status Status code for the response.
         * @param {Object} payload Payload to return to the client.
         */
        const afterRoute = (status = 200, payload = {}) => {
            // NOTE: Implicit type check its better, default values only work in case its undefined,
            // if, for example, payload its a string, this method will not override it with an object!
            // But with jsdocs (or Typescript) this is not a problem as this properties are static typed. 

            // set json header
            res.setHeader("Content-Type", "application/json");

            // set the status code
            res.writeHeader(status);

            // end conexion with payload
            res.end(JSON.stringify(payload));

            // log request response
            log(`Reponse -> Status: ${status} Resp: ${JSON.stringify(payload, null, 2)}`);
        };

        // Try find a route
        for (const [routePath, route] of Object.entries(routes)) {
            // If route is internal, ignore
            if (route.internal) continue;

            if (
                // If routepath is of type string, check if its the same as the request path
                (typeof routePath === "string" && routePath === trimmedPath) ||
                // else check if its a RegExp, if it is, execute it in the request path
                (routePath instanceof RegExp && trimmedPath.match(routePath))
            ) {
                if (typeof route[req.method.toLowerCase()] === "function") {
                    // Call the corresponding route with specific request method
                    return route[req.method.toLowerCase()](data, afterRoute);
                } else {
                    // If route found, but no method to handle it
                    return routes["501"]["all"](data, afterRoute);
                }
            }
        }

        // If no route found, call 404
        routes["404"]["all"](data, afterRoute);
    });
}