/**
 * This method start authentication workflow.
 * It should be called by application which require authentication.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var uuid = require('uuid');
var async = require('async');
var oxutil = require('../util/util.js');
var state = require('../shared/state.js');
var push = require('../push/push.js');

exports.rest_api = function(req, res, authenticationStore, applicationService, deviceService) {
	console.log("Authenticate: '" + req.params.deployment_id + "'", "user: '" + req.params.user_name + "'");

	// Load device and application entries
	async.series([ function(done) {
		deviceService.getDeviceById(req.params.deployment_id, function(found_deployment_entry) {
			deployment_entry = found_deployment_entry;
			done();
		});
	}, function(done) {
		if (deployment_entry) {
			applicationService.getApplication(deployment_entry.oxPushApplication, function(found_application_entry) {
				application_entry = found_application_entry;
				done();
			});
		} else {
			console.warn("Failed to find deployment entry: '%s'", req.params.deployment_id);
			oxutil.sendFailedJsonResponse(res);
			done();
		}
	} ], function() {
		if (application_entry && deployment_entry) {
			var application_configuration = JSON.parse(application_entry.oxPushApplicationConf);
			
			// TODO: Validate application_ip and req.ip
			
			var authentication_id = uuid.v1();
			var authentication_entry = {
				'authentication_id' : authentication_id,
				'authentication_time' : Date.now(),
				'expires_in' : 60,
				'expires_at' : Date.now() + 60 * 1000,
				'clean_up_at' : Date.now() + 180 * 1000,
				'application_id' : application_entry.oxId,
				'application_name' : application_configuration.name,
				'application_description' : application_configuration.description,
				'application_ip' : req.ip,
				'user_name' : req.params.user_name,
				'authentication_status' : state.PENDING,
			};

			authenticationStore.set(authentication_id, authentication_entry);

			// Send message to device
			var device_configuration = JSON.parse(deployment_entry.oxPushDeviceConf);
			try {
				push.sendAuthenticationMessageToDevice(device_configuration, authentication_id);
			} catch (err) {
				console.log("Failed to send notification message to device: '" + device_configuration.device_uuid);
			}

			console.log("Initialized authentication process: '" + authentication_id + "' for application: '"
					+ authentication_entry.application_name + "'");
			oxutil.sendJsonResponse(res, {
				authentication_id : authentication_entry.authentication_id,
				expires_in : authentication_entry.expires_in,
				result : true,
			});
		} else {
			console.warn("Failed to find application entry: '%s'", deployment_entry.oxPushApplication);
			oxutil.sendFailedJsonResponse(res);
		}
	});
};
