/**
 * This method allow to approve/decline paring request.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var uuid = require('uuid');
var oxutil = require('../util/util.js');
var state = require('../shared/state.js');

exports.rest_api = function(req, res, pairingStore, deviceService) {
	console.log("Approve pairing: '" + req.params.pairing_id + "', pairing result: '" + req.params.pairing_result
			+ "', device configuration: '" + JSON.stringify(req.body) + "'");

	if (!(req.body.device_uuid || req.body.device_token || req.body.device_type || req.body.device_name || req.body.os_name || req.body.os_version)) {
		console.warn("There is no enough information in request");
		oxutil.sendFailedJsonResponse(res);
		return;
	}

	pairingStore.get(req.params.pairing_id, function(err, pairing_entry) {
		if (err) {
			console.warn("Failed to find pairing record: '" + req.params.pairing_id + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (pairing_entry) {
				if (('pending' != pairing_entry.pairing_status) || (pairing_entry.expires_at < Date.now())) {
					console.log("Pairing request is already approved or out of date");
					pairing_entry.pairing_status = state.EXPIRED;
					pairing_entry.deployment_id = undefined;
					oxutil.sendFailedJsonResponse(res);
				} else {
					console.log("Found pairing entry: '" + JSON.stringify(pairing_entry) + "'");
					if ("true" == req.params.pairing_result) {
						pairing_entry.pairing_status = state.APPROVED;
					} else {
						console.log("Declined pairing request: '" + req.params.pairing_id + "'");
						pairing_entry.pairing_status = state.DECLINED;

						oxutil.sendJsonResponse(res, {
							'result' : true
						});
						return;
					}

					var deployment_id = uuid.v1();

					// Update pairing entry
					pairing_entry.deployment_id = deployment_id;

					var deployment_entry = {
						device_uuid : req.body.device_uuid,
						device_token : req.body.device_token,
						device_type : req.body.device_type,
						device_name : req.body.device_name,
						os_name : req.body.os_name,
						os_version : req.body.os_version,
						approve_time : Date.now(),
						approve_ip : req.ip,
					};					

					console.log("Storing deployment entry: '" + JSON.stringify(deployment_entry) + "'");
					deviceService.addDevice(deployment_id, pairing_entry.application_id, pairing_entry.user_name, deployment_entry, function(result) {
						if (result) {
							oxutil.sendJsonResponse(res, {
								'deployment_id' : pairing_entry.deployment_id,
								'result' : true
							});
						} else {
							console.error("Failed to add deployment entry: '%s', deployment_entry: '%s'", deployment_id, deployment_entry);
							oxutil.sendFailedJsonResponse(res);
						}
					});
				}
			} else {
				console.warn("Failed to find pairing record: '" + req.params.pairing_id + "'");
				oxutil.sendFailedJsonResponse(res);
			}
		}
	});
};