/**
 * Module dependencies.
 */
import app from "@www/app";
const debug = require("debug")("www:server");
import * as http from "http";

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || "3000";
app.set("port", port);

/**
 * Create HTTP server.
 * $FlowFixMe
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
	debug("Listening on " + bind);
}
