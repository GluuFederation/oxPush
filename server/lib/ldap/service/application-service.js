/**
 * Provides LDAP operations with devices.
 * 
 * Author: Yuriy Movchan Date: 11/06/2013
 */
var util = require('util');

function ApplicationService(ldapClient) {
	this.ldapClient = ldapClient;
}

module.exports = ApplicationService;

ApplicationService.prototype.containsApplicationId = function containsApplicationId(applicationId, callback) {
	var applicationDn = this.ldapClient.getDn("ou=application,ou=push", 'oxId=' + applicationId);
	this.ldapClient.contains(applicationDn, function(result) {
		callback && callback(result);
	});
};

ApplicationService.prototype.getApplication = function getApplication(deviceDn, callback) {
	this.ldapClient.get(deviceDn, function(entry) {
		callback && callback(entry);
	});
};

ApplicationService.prototype.getApplicationByName = function getApplicationByName(name, callback) {
	var applicationDn = this.ldapClient.getDn("ou=application,ou=push");
	this.ldapClient.search(applicationDn, util.format('&(objectClass=oxPushApplication)(oxName=%s)', name.toLowerCase()), [], 'sub', 2,
			function(entries) {
				if (entries == null) {
					callback && callback(null);
				}
				if (entries.length == 1) {
					callback && callback(entries[0]);
				} else {
					console.error("There are more than one application with name '%s'", name);
				}
			});
};

ApplicationService.prototype.addApplication = function addApplication(applicationId, application, callback) {
	var applicationDn = this.ldapClient.getDn("ou=application,ou=push", 'oxId=' + applicationId);
	var attrs = {
		'oxId' : applicationId,
		'oxName' : application.name.toLowerCase().trim(),
		'displayName' : application.description.toLowerCase(),
		'oxPushApplicationConf' : JSON.stringify(application),
		'objectClass' : [ 'top', 'oxPushApplication' ]
	};
	this.ldapClient.add(applicationDn, attrs, function(result) {
		callback && callback(result);
	});
};
