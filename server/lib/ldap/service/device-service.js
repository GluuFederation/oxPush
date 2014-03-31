/**
 * Provides LDAP operations with devices.
 * 
 * Author: Yuriy Movchan Date: 11/06/2013
 */

function DeviceService(ldapClient) {
	this.ldapClient = ldapClient;
}

module.exports = DeviceService;

DeviceService.prototype.containsDeviceId = function containsDeviceId(deviceId, callback) {
	var deviceDn = this.ldapClient.getDn("ou=device,ou=push", 'oxId=' + deviceId);
	this.ldapClient.contains(deviceDn, function(result) {
		callback && callback(result);
	});
};

DeviceService.prototype.getDeviceById = function getDeviceById(deviceId, callback) {
	var deviceDn = this.ldapClient.getDn("ou=device,ou=push", 'oxId=' + deviceId);
	this.ldapClient.get(deviceDn, function(entry) {
		callback && callback(entry);
	});
};

DeviceService.prototype.addDevice = function addDevice(deviceId, application_id, user_id, device, callback) {
	var deviceDn = this.ldapClient.getDn("ou=device,ou=push", 'oxId=' + deviceId);
	var applicationDn = this.ldapClient.getDn("ou=application,ou=push", 'oxId=' + application_id);
	var attrs = {
		'oxId' : deviceId,
		'oxType' : device.os_name.toLowerCase().trim(),
		'oxPushApplication' : applicationDn,
		'oxAuthUserId' : user_id,
		'oxPushDeviceConf' : JSON.stringify(device),
		'objectClass' : [ 'top', 'oxPushDevice' ]
	};
	this.ldapClient.add(deviceDn, attrs, function(result) {
		callback && callback(result);
	});
};

DeviceService.prototype.deleteDeviceId = function deleteDeviceId(deviceId, callback) {
	var deviceDn = this.ldapClient.getDn("ou=device,ou=push", 'oxId=' + deviceId);
	this.deleteDeviceDn(deviceDn, callback);
};

DeviceService.prototype.deleteDeviceDn = function deleteDeviceDn(deviceDn, callback) {
	this.ldapClient.del(deviceDn, function(result) {
		callback && callback(result);
	});
};
