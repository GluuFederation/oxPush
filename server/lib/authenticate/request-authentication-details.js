/**
 * This method allows mobile application to get more information about authentication request.
 * Server provides it because push notification message has size constrain on some platforms.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var oxutil = require('../util/util.js');

exports.rest_api = function(req, res, authenticationStore) {
	console.log("Get authentication details: '" + req.params.authentication_id + "'");

	authenticationStore.get(req.params.authentication_id, function(err, authentication_entry) {
		if (err) {
			console.warn("Failed to find authentication record: '" + req.params.authentication_id + "'. Error: " + err);
			oxutil.sendFailedJsonResponse(res);
			next(err);
		} else {
			if (authentication_entry) {
				oxutil.sendJsonResponse(res, {
					user_name : authentication_entry.user_name,
					application_name : authentication_entry.application_name,
					application_ip : authentication_entry.application_ip,
					application_description : authentication_entry.application_description,
					authentication_time : authentication_entry.authentication_time,
					result : true
				});
			} else {
				console.warn("Failed to find authentication record: '" + req.params.authentication_id + "'");
				oxutil.sendFailedJsonResponse(res);
			}
		}
	});
};