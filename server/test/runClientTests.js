/**
 * Helper which run application server and client side test
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var os = require('os');
var spawn = require('child_process').spawn;
var async = require('async');

// Set development mode
process.env.env = 'development';

var oxPushServer = require('../lib/server/server.js');

oxPushServer.start(undefined, function() {
	async.series([ function(done) {
		registerDevelopmentDevice(done);
	}, function(done) {
		registerDevelopmentApplication(done);
	}, function(done) {
		runJasmine();

		done();
	} ]);
});

function registerDevelopmentApplication(callback) {
	// Add testing device
	oxPushServer.addApplication('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', {
		"name" : "gluu_test",
		"description" : "gluu_test description",
		"platforms" : [ {
			'name' : "android",
			'api_key' : "AIzaSyDo02iN0qaqaaaxjQKhky0K-E71Hr9Di5w",
		}, {
			'name' : "ios",
			'cert_path' : "/etc/gluu/cert/oxpush_ios_cert.pem",
		} ],
	}, callback);
}

function registerDevelopmentDevice(callback) {
	// Add testing device
	oxPushServer.addDevice('c61a85d0-453f-11e3-b52e-ed6cfb0fb7da', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'test_user', {
		device_uuid: "000aa00000a0000a",
		device_token : "1234-5678-01234",
		device_type : "mobile",
		device_name: "GT-S5660",
		os_name : "Android",
		os_version : "2.3.1",
		approve_time : 1383562596014,
		approve_ip : "127.0.0.1"
	}, callback);
}

function runJasmine() {
	// On server ready launch the jasmine-node process with your test file
	var jasmineCommand = 'jasmine-node';
	if ('Windows_NT' == os.type()) {
		jasmineCommand += ".cmd";
	}

	var jasmineNode = spawn(jasmineCommand, [ '--verbose', '--junitreport', './client' ]);
	jasmineNode.on('error', function(err) {
		logToConsole(err);
		oxPushServer.shutdown();
	});

	// Logs process stdout/stderr to the console
	function logToConsole(data) {
		console.log(String(data));
	}

	jasmineNode.stdout.on('data', logToConsole);
	jasmineNode.stderr.on('data', logToConsole);

	jasmineNode.on('exit', function(exitCode) {
		// When jasmine-node is done, shuts down the application server
		oxPushServer.shutdown();
	});
}
