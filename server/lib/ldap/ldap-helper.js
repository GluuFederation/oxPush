/**
 * Ldap helper.
 *
 * Author: Yuriy Movchan Date: 11/07/2013
 */

var async = require('async');
var LdapClient = require('../ldap/client.js');
var ApplicationService = require('./service/application-service.js');
var DeviceService = require('./service/device-service.js');
var EntryService = require('./service/entry-service.js');

var BASE_DN = process.env.LDAP_BASE_DN;
if (!BASE_DN) {
	throw new Error("LDAP_BASE_DN environment variable isn't set!");
}

var ldapClient = new LdapClient(BASE_DN);
var entryService = new EntryService(ldapClient);

module.exports = {
	ldapClient : ldapClient,
	entryService : entryService,
	applicationService : new ApplicationService(ldapClient),
	deviceService : new DeviceService(ldapClient),
	prepareDefaultEntires : prepareDefaultEntires,
};

function prepareDefaultEntires(callback) {
	if (typeof (callback) !== 'function') {
		throw new TypeError('Callback (function) required');
	}

	async.series([ function(done) {
		var baseDn = ldapClient.getDn('', 'ou=push');

		var entry = {
			ou : 'push',
			objectclass : [ 'top', 'organizationalUnit' ]
		};

		entryService.addEntryIfNotExist(baseDn, entry, done);
	}, function(done) {
		var baseDn = ldapClient.getDn('', 'ou=configuration');
		var entry = {
			ou : 'configuration',
			objectclass : [ 'top', 'organizationalUnit' ]
		};

		entryService.addEntryIfNotExist(baseDn, entry, done);
	}, function(done) {
		var baseDn = ldapClient.getDn('ou=push', 'ou=application');
		var entry = {
			ou : 'application',
			objectclass : [ 'top', 'organizationalUnit' ]
		};

		entryService.addEntryIfNotExist(baseDn, entry, done);
	}, function(done) {
		var baseDn = ldapClient.getDn('ou=push', 'ou=device');

		var entry = {
			ou : 'device',
			objectclass : [ 'top', 'organizationalUnit' ]
		};

		entryService.addEntryIfNotExist(baseDn, entry, done);
	}, function(done) {
		process.nextTick(function() {
			callback();
		});

		done();
	}

	]);
}
