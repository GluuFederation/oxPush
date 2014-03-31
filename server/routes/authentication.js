/**
 * Authentication endpoints.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var ObjectStore = require('../lib/util/store.js');
var authenticationStore = new ObjectStore();

var authenticate = require('../lib/authenticate/authenticate');
var check_authentication = require('../lib/authenticate/check-authentication');
var request_authentication_details = require('../lib/authenticate/request-authentication-details');
var approve_authentication = require('../lib/authenticate/approve-authentication');

module.exports = function(app, ldapHelper) {
	app.get('/authenticate/:deployment_id/:user_name', function(req, res, next) {
		authenticate.rest_api(req, res, authenticationStore, ldapHelper.applicationService, ldapHelper.deviceService);
	});

	app.get('/request_authentication_details/:authentication_id', function(req, res, next) {
		request_authentication_details.rest_api(req, res, authenticationStore);
	});

	app.get('/check_authentication/:authentication_id', function(req, res, next) {
		check_authentication.rest_api(req, res, authenticationStore);
	});

	app.get('/approve_authentication/:authentication_id/:authentication_result', function(req, res, next) {
		approve_authentication.rest_api(req, res, authenticationStore);
	});

	// TODO: Add timer to clean up
};
