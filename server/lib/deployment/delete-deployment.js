/**
 * This method cancel pairing device with account.
 *
 * Author: Yuriy Movchan Date: 12/06/2013
 */

var oxutil = require('../util/util.js');

exports.rest_api = function(req, res, deviceService) {
	console.log("Delete deployment: '" + req.params.deployment_id + "'");
	
	var deploymentId = req.params.deployment_id;
	deviceService.containsDeviceId(deploymentId, function(result) {
		if (result) {
			deviceService.deleteDeviceId(deploymentId, function(result) {
				if (result) {
					// TODO: Check device UUID in request
					oxutil.sendJsonResponse(res, {
						'result' : true,
						'exist' : true
					});
				} else {
					console.warn("Failed to delete deployment entry: '%s'", deploymentId);
					oxutil.sendFailedJsonResponse(res);
				}
			});
		} else {
			console.warn("Entry was deleted already: '%s'", deploymentId);
			oxutil.sendJsonResponse(res, {
				'result' : true,
				'exist' : false
			});
		}
	});
};