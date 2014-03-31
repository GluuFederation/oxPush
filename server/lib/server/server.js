/**
 * Application server.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');

var logHelper = require('../util/log-helper.js');
var ldapHelper = require('../ldap/ldap-helper.js');

//Configure logging
logHelper.prepareLogFolder();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(process.env.CONTEXT_PATH || '/oxpush', app.router);
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Web pages
require('../../routes/web')(app);

// REST API
require('../../routes/deployment')(app, ldapHelper);
require('../../routes/authentication')(app, ldapHelper);
require('../../routes/pairing')(app, ldapHelper);

var server;

exports.start = function(config, callback) {
	async.series([ function(done) {
		// Configure LDAP
		ldapHelper.prepareDefaultEntires(done);
	}, function(done) {
		server = http.createServer(app).listen(app.get('port'), function() {
			console.log('Express server listening on port ' + app.get('port'));

			process.nextTick(function() {
				// Callback to call when the server is ready
				if (callback) {
					callback();
				}
			});

			done();
		});
	} ]);
};

exports.shutdown = function shutdown() {
	async.series([ function(done) {
		server.close(function() {
			console.log("Closed out remaining server connections.");

			done();
		});
	}, function(done) {
		ldapHelper.ldapClient.shutdown(function() {
			console.log("Closed out remaining LDAP connections.");

			done();
		});

	}, function(done) {
		process.nextTick(function() {
			process.exit();
		});

		done();
	} ], function() {
		
	});

	setTimeout(function() {
		console.error("Could not close connections in time, forcing shut down");
		process.exit(1);
	}, 30 * 1000);
};

// Allow to add devices only in development mode
if ('development' == app.get('env')) {
	exports.addDevice = function(device_id, application_id, user_id, device, callback) {
		ldapHelper.deviceService.containsDeviceId(device_id, function(result) {
			if (result) {
				callback && callback();
			} else {
				ldapHelper.deviceService.addDevice(device_id, application_id, user_id, device, function(result) {
					if (result) {
						console.log("Added development device entry: '%s'", device_id);
					}
					callback && callback();
				});
			}
		});
	};

	exports.addApplication = function(application_id, application, callback) {
		ldapHelper.applicationService.containsApplicationId(application_id, function(result) {
			if (result) {
				callback && callback();
			} else {
				ldapHelper.applicationService.addApplication(application_id, application, function(result) {
					if (result) {
						console.log("Added development application entry: '%s'", application_id);
					}
					callback && callback();
				});
			}
		});
	};
}
