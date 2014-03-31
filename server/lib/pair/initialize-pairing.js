/**
 * This methods start pairing workflow. It should be called by application which
 * require pairing user account with oxPush on mobile device.
 * 
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var async = require('async');
var uuid = require('uuid');
var qrcode = require('qrcode-npm');
var oxutil = require('../util/util.js');
var state = require('../shared/state.js');

exports.rest_api = function(req, res, applicationService, pairingStore, pairingCodeStore) {
	console.log("Initialize pairing process for application: '"
			+ req.params.application_name + "'", "user: '" + req.params.user_name + "'");

	var application_name = req.params.application_name;
	if (!application_name || application_name.length == 0) {
		console.warn("Failed to initialize pairing. Application name is empty");
		oxutil.sendFailedJsonResponse(res);

		return;
	}

	application_name = application_name.toLowerCase().trim();

	applicationService.getApplicationByName(application_name, function(
			application_entry) {
		if (application_entry) {
			var pairing_id = pairing_code = pairing_qr_image = null;

			async.series([ function(done) {
				pairing_id = uuid.v1();
				done();
			}, function(done) {
				pairing_code = oxutil.randomHexString(4, function(err) {
					console.error("Failed to generate pairing code");
					done(err);
				});

				if (pairing_code) {
					done();
				}
			}, function(done) {
				var qr = qrcode.qrcode(4, 'M');
				qr.addData('pairing_code:' + pairing_code);
				qr.make();
				pairing_qr_image = qr.createImgTag(4);

				done();
			} ], function(err) {
				if (err) {
					console.error("Failed to initialize pairing process", err);
					oxutil.sendFailedJsonResponse(res);
					return;
				}
				var application_configuration = JSON.parse(application_entry.oxPushApplicationConf);

				var pairing_entry = {
					'pairing_id' : pairing_id,
					'pairing_code' : pairing_code,
					'pairing_qr_image' : pairing_qr_image,
					'pairing_time' : Date.now(),
					'expires_in' : 60,
					'expires_at' : Date.now() + 60 * 1000,
					'clean_up_at' : Date.now() + 180 * 1000,
					'application_entry' : application_entry,
					'application_id' : application_entry.oxId,
					'application_name' : application_configuration.name,
					'application_description' : application_configuration.description,
					'application_ip' : req.ip,
					'user_name' : req.params.user_name,
					'pairing_status' : state.PENDING,
				};
				// Store pairing_id and related information
				pairingStore.set(pairing_id, pairing_entry);
				
				// Store mapping to pairing_id by pairing_code
				pairingCodeStore.set(pairing_code, {'pairing_id' : pairing_id});

				console.log("Initialized pairing process: '" + pairing_id
						+ "' for application_name: '"
						+ pairing_entry.application_name + "'");
				oxutil.sendJsonResponse(res, {
					'pairing_id' : pairing_entry.pairing_id,
					'pairing_code' : pairing_entry.pairing_code,
					'pairing_qr_image' : pairing_entry.pairing_qr_image,
					'expires_in' : pairing_entry.expires_in,
					'result' : true,
				});
			});
		} else {
			console.warn("Failed to find application '%s'", application_name);
			oxutil.sendFailedJsonResponse(res);
		}
	});
};