/**
 * This method checks if user paired device with account.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var oxutil = require('../util/util.js');

exports.rest_api = function(req, res, deviceService) {
	console.log("Check deployment: '" + req.params.deployment_id + "'");

	deviceService.containsDeviceId(req.params.deployment_id, function(deployment_entry) {
		if (deployment_entry) {
			oxutil.sendJsonResponse(res, {
				'deployment_status' : 'enabled',
				'result' : true
			});
		} else {
			console.warn("Failed to find deployment entry: '%s'", req.params.deployment_id);
			oxutil.sendFailedJsonResponse(res);
		}
	});
};