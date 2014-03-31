/**
 * This method send approve/decline authentication request.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var uuid = require('uuid');
var oxutil = require('../util/util.js');
var state = require('../shared/state.js');

exports.rest_api = function(req, res, authenticationStore) {
	console
			.log("Approve authentication: '%s', authentication result: '%s'", req.params.authentication_id,
					req.params.authentication_result);

	authenticationStore.get(req.params.authentication_id, function(err, authentication_entry) {
		if (err) {
			console.warn("Failed to find authentication record: '" + req.params.authentication_id + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (authentication_entry) {
				if (('pending' != authentication_entry.authentication_status) || (authentication_entry.expires_at < Date.now())) {
					console.log("Authentication request is already authenticatied or out of date");
					authentication_entry.authentication_status = state.EXPIRED;
					authentication_entry.authentication_id = undefined;
					oxutil.sendFailedJsonResponse(res);
				} else {
					console.log("Found authentication entry: '" + JSON.stringify(authentication_entry) + "'");

					// Update authentication entry
					if ("true" == req.params.authentication_result) {
						authentication_entry.authentication_status = state.APPROVED;
					} else {
						authentication_entry.authentication_status = state.DECLINED;
					}

					oxutil.sendJsonResponse(res, {
						'result' : true
					});
				}
			} else {
				console.warn("Failed to find authentication record: '" + req.params.authentication_id + "'");
				oxutil.sendFailedJsonResponse(res);
			}
		}
	});
};