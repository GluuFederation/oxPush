/**
 * Deployment endpoints.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var check_deployment = require('../lib/deployment/check-deployment.js');
var delete_deployment = require('../lib/deployment/delete-deployment.js');

module.exports = function(app, ldapHelper) {
	app.get('/check_deployment/:deployment_id', function(req, res, next) {
		check_deployment.rest_api(req, res, ldapHelper.deviceService);
	});

	app.post('/delete_deployment/:deployment_id', function(req, res, next) {
		delete_deployment.rest_api(req, res, ldapHelper.deviceService);
	});

};