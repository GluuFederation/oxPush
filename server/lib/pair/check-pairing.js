/**
 * This method provides paring status.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var oxutil = require('../util/util.js');
var oxconf = require('../conf/configuration.js');

exports.rest_api = function(req, res, pairingStore) {
	if (oxconf.trace) {
		console.log("Check pairing: '" + req.params.pairing_id + "'");
	}

	pairingStore.get(req.params.pairing_id, function(err, pairing_entry) {
		if (err) {
			console.warn("Failed to find pairing record: '" + req.params.pairing_id + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (pairing_entry) {
				oxutil.sendJsonResponse(res, {
					'deployment_id' : pairing_entry.deployment_id,
					'pairing_status' : pairing_entry.pairing_status,
					'result' : true
				});
			} else {
				console.warn("Failed to find pairing record: '" + req.params.pairing_id + "'");
				oxutil.sendFailedJsonResponse(res);
			}
		}
	});
};
