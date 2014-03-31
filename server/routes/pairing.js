/**
 * Pairing endpoints.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var express = require('express');
var ObjectStore = require('../lib/util/store.js');
var pairingStore = new ObjectStore();
var pairingCodeStore = new ObjectStore();

var initialize_pairing = require('../lib/pair/initialize-pairing.js');
var request_pairing_details = require('../lib/pair/request-pairing-details.js');
var approve_pairing = require('../lib/pair/approve-pairing.js');
var check_pairing = require('../lib/pair/check-pairing.js');
var validate_pairing_code = require('../lib/pair/validate-pairing-code.js');

module.exports = function(app, ldapHelper) {
	app.get('/initialize_pairing/:application_name/:user_name', function(req, res, next) {
		initialize_pairing.rest_api(req, res, ldapHelper.applicationService, pairingStore, pairingCodeStore);
	});

	app.get('/validate_pairing_code/:pairing_code', function(req, res, next) {
		validate_pairing_code.rest_api(req, res, pairingStore, pairingCodeStore);
	});

	app.get('/request_pairing_details/:pairing_id', function(req, res, next) {
		request_pairing_details.rest_api(req, res, pairingStore);
	});

	app.get('/check_pairing/:pairing_id', function(req, res, next) {
		check_pairing.rest_api(req, res, pairingStore);
	});

	app.post('/approve_pairing/:pairing_id/:pairing_result', express.bodyParser(), function(req, res, next) {
		approve_pairing.rest_api(req, res, pairingStore, ldapHelper.deviceService);
	});

	// TODO: Add timer to clean up out of date pairing entries
};