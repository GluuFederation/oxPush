/**
 * This method allows mobile application to get more information about pairing request.
 * Server provides it because push notification message has size constrain on some platforms.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var oxutil = require('../util/util.js');

exports.rest_api = function(req, res, pairingStore) {
	console.log("Get pairing details: '" + req.params.pairing_id + "'");

	pairingStore.get(req.params.pairing_id, function(err, pairing_entry) {
		if (err) {
			console.warn("Failed to find pairing record: '" + req.params.pairing_id + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (pairing_entry) {
				oxutil.sendJsonResponse(res, {
					user_name : pairing_entry.user_name,
					application_name : pairing_entry.application_name,
					application_ip : pairing_entry.application_ip,
					application_description : pairing_entry.application_description,
					pairing_time : pairing_entry.pairing_time,
					result : true
				});
			} else {
				console.warn("Failed to find pairing record: '" + req.params.pairing_id + "'");
				oxutil.sendFailedJsonResponse(res);
			}
		}
	});
};