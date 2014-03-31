/**
 * Server runner.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var oxPushServer = require('./lib/server/server.js');
oxPushServer.start();

process.on('SIGINT', oxPushServer.shutdown);
process.on('SIGTERM', oxPushServer.shutdown);
