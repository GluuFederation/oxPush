/**
 * Operations with oxPush server
 * 
 * Author: Yuriy Movchan Date: 11/27/2013
 */
function OXServer() {}

OXServer.prototype.init = function init(id) {
}

OXServer.prototype.validatePairingCode = function validatePairingCode(pairingCode, callback) {
	var self = this;
	$.ajax({
		url : oxconf.oxPushServerUri + '/validate_pairing_code/' + pairingCode,
		type : 'get',
		error : function() {
			self.debug('Failed to send validate_pairing_code request to oxPushServer.');
			callback(null);
		},
		success : function(data) {
			self.debug('Successfully send validate_pairing_code request to oxPushServer.');

			if (true == data.result) {
				callback(data.pairing_id);
			} else {
				self.debug('Pairing code is invalid or expired');
				callback(null);
			}
		}
	});
}

OXServer.prototype.pairDevice = function pairDevice(pairingId, pairResult, pushNotificationRegistrationId, callback) {
	var self = this;
	$.ajax({
		url : oxconf.oxPushServerUri + '/approve_pairing/' + pairingId + '/' + pairResult,
		type : 'post',
		dataType : 'json',
		data : {
			device_uuid : device.uuid,
			device_token : pushNotificationRegistrationId,
			device_type : 'mobile',
			device_name : device.model,
			os_name : device.platform,
			os_version : device.version
		},
		error : function() {
			self.debug('Failed to send approve_pairing request to oxPushServer.');
			callback(false);
		},
		success : function(data) {
			self.debug('Successfully send approve_pairing request to oxPushServer.');

			if (true == data.result) {
				callback(data.result, data.deployment_id);
			} else {
				self.debug('Pairing Id is invalid or expired');
				callback(false);
			}
		}
	});
}

OXServer.prototype.authenticateDevice = function authenticateDevice(authenticationCode, authenticateResult, callback) {
	var self = this;
	$.ajax({
		url : oxconf.oxPushServerUri + '/approve_authentication/' + authenticationCode + '/' + authenticateResult,
		type : 'get',
		error : function() {
			self.debug('Failed to send approve_authentication request to oxPushServer.');
			callback(false);
		},
		success : function(data) {
			self.debug('Successfully send approve_authentication request to oxPushServer.');

			if (true == data.result) {
				callback(data.result);
			} else {
				self.debug('Authentication Id is invalid or expired');
				callback(false);
			}
		}
	});
}

OXServer.prototype.getPairingDetails = function getPairingDetails(pairingCode, callback) {
	var self = this;
	$.ajax({
		url : oxconf.oxPushServerUri + '/request_pairing_details/' + pairingCode,
		type : 'get',
		error : function() {
			self.debug('Failed to send request_pairing_details request to oxPushServer.');
			callback(null);
		},
		success : function(data) {
			self.debug('Successfully send request_pairing_details request to oxPushServer.');

			if (true == data.result) {
				callback(data);
			} else {
				self.debug('Pairing code is invalid or expired');
				callback(null);
			}
		}
	});
}

OXServer.prototype.getAuthenticationDetails = function getAuthenticationDetails(authenticationCode, callback) {
	var self = this;
	$.ajax({
		url : oxconf.oxPushServerUri + '/request_authentication_details/' + authenticationCode,
		type : 'get',
		error : function() {
			self.debug('Failed to send request_authentication_details request to oxPushServer.');
			callback(false);
		},
		success : function(data) {
			self.debug('Successfully send request_authentication_details request to oxPushServer.');

			if (true == data.result) {
				callback(data);
			} else {
				self.debug('Authentication code is invalid or expired');
				callback(false);
			}
		}
	});
}

OXServer.prototype.deleteDeployment = function deleteDeployment(deploymentId, callback) {
	var self = this;
	$.ajax({
		url : oxconf.oxPushServerUri + '/delete_deployment/' + deploymentId,
		type : 'post',
		dataType : 'json',
		data : {
			device_uuid : device.uuid,
		},
		error : function() {
			// We can't validate pairing code
			self.debug('Failed to send delete_deployment request to oxPushServer.');
			callback(false);
		},
		success : function(data) {
			self.debug('Successfully send delete_deployment request to oxPushServer.');

			if (true == data.result) {
				callback(data);
			} else {
				self.debug('Deployment id is invalid or expired');
				callback(false);
			}
		}
	});
}

OXServer.prototype.debug = function debug(message) {
	if (oxconf.debug) {
		console.log('oxPush: ' + message);
	}
}

var oxserver = new OXServer();

// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady(id) {
	oxserver.init(id);
}
