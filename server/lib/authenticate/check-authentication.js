/**
 * This method provides authentication status.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var oxutil = require('../util/util.js');
var oxconf = require('../conf/configuration.js');

exports.rest_api = function(req, res, authenticationStore) {
	if (oxconf.trace) {
		console.log("Check authentication: '" + req.params.authentication_id + "'");
	}

	authenticationStore.get(req.params.authentication_id, function(err, authentication_entry) {
		if (err) {
			console.warn("Failed to find authentication record: '" + req.params.authentication_id + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (authentication_entry) {
				oxutil.sendJsonResponse(res, {
					'authentication_status' : authentication_entry.authentication_status,
					'result' : true
				});
			} else {
				console.warn("Failed to find authentication record: '" + req.params.authentication_id + "'");
				oxutil.sendFailedJsonResponse(res);
			}
		}
	});
};