/**
 * This method provides paring id by pairing code.
 *
 * Author: Yuriy Movchan Date: 11/20/2013
 */

var oxutil = require('../util/util.js');

exports.rest_api = function(req, res, pairingStore, pairingCodeStore) {
	console.log("Validate pairing code: '" + req.params.pairing_code + "'");

	pairingCodeStore.get(req.params.pairing_code, function(err, pairing_code_entry) {
		if (err) {
			console.warn("Failed to find pairing code record: '" + req.params.pairing_code + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (pairing_code_entry) {
				oxutil.sendJsonResponse(res, {
					'pairing_id' : pairing_code_entry.pairing_id,
					'result' : true
				});
			} else {
				console.warn("Failed to find pairing code record: '" + req.params.pairing_code + "'");
				oxutil.sendJsonResponse(res, {
					'result' : false
				});
			}
		}
	});
};
