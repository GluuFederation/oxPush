/**
 * Local storage
 *
 * Author: Yuriy Movchan Date: 11/27/2013
 */
function LocalDB() {}

LocalDB.prototype.init = function init(id) {
	this.localStorage = window.localStorage;
}

LocalDB.prototype.setPushNotificationRegistrationId = function setPushNotificationRegistrationId(registrationId) {
	this.localStorage.setItem('push_notification_registration_id', registrationId);
}

LocalDB.prototype.getPushNotificationRegistrationId = function getPushNotificationRegistrationId() {
	return this.localStorage.getItem('push_notification_registration_id');
}

LocalDB.prototype.addDeployment = function addDeployment(deploymentId, details) {
	var deploymentsListStr = this.localStorage.getItem('deployment_idx');
	var deploymentLastIdx = this.localStorage.getItem('deployment_last_idx');

	var deploymentIdx = 0;
	var deploymentsList = null;

	if (deploymentsListStr != null) {
		deploymentsList = JSON.parse(deploymentsListStr);
		if (deploymentsList.deployments) {
			deploymentIdx = parseInt(deploymentLastIdx) + 1;
			deploymentsList.deployments.push(deploymentIdx);
		} else {
			deploymentsList = null;
		}
	}

	if (deploymentsList == null) {
		deploymentsList = {
			deployments : [ deploymentIdx ]
		};
	}

	deploymentsList.last_update = Date.now();
	deploymentsListStr = JSON.stringify(deploymentsList);

	var deployment_details = {
		deployment_idx : deploymentIdx,
		deployment_id : deploymentId,
		user_name : details.user_name,
		application_name : details.application_name,
		application_description : details.application_description,
		application_ip : details.application_ip,
		server_pairing_time : details.pairing_time,
		mobile_pairing_time : Date.now()
	};

	this.localStorage.setItem('deployment_idx', deploymentsListStr);
	this.localStorage.setItem('deployment_last_idx', deploymentIdx);
	this.localStorage.setItem('deployment_' + deploymentIdx, JSON.stringify(deployment_details));
}

LocalDB.prototype.deleteDeployment = function deleteDeployment(deploymentIdx) {
	var deploymentsListStr = this.localStorage.getItem('deployment_idx');
	if (deploymentsListStr != null) {
		var deploymentsList = JSON.parse(deploymentsListStr);
		if (deploymentsList.deployments) {
			deleteArrayElement(deploymentsList.deployments, deploymentIdx);

			deploymentsListStr = JSON.stringify(deploymentsList);

			this.localStorage.setItem('deployment_idx', deploymentsListStr);
			this.localStorage.removeItem('deployment_' + deploymentIdx);
		}
	}
}

LocalDB.prototype.getDeployment = function getDeployment(deploymentIdx) {
	var value = this.localStorage.getItem('deployment_' + deploymentIdx);
	if (value != null) {
		return JSON.parse(value);
	} else {
		return null;
	}
}

LocalDB.prototype.getDeployments = function getDeployments() {
	var result = [];

	var deploymentsListStr = this.localStorage.getItem('deployment_idx');
	if (deploymentsListStr != null) {
		var deployments = JSON.parse(deploymentsListStr).deployments;
		if (deployments) {
			for (var i = 0; i < deployments.length; i++) {
				var deploymentIdx = deployments[i];

				var deployment = this.getDeployment(deploymentIdx);
				if (deployment != null) {
					result.push(deployment);
				}
			}
		}
	}

	return result;
}

LocalDB.prototype.hasDeployments = function hasDeployments() {
	var deploymentsListStr = this.localStorage.getItem('deployment_idx');
	if (deploymentsListStr != null) {
		var deployments = JSON.parse(deploymentsListStr).deployments;
		if (deployments) {
			return deployments.length > 0;
		}
	}

	return false;
}

var localdb = new LocalDB();

// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady(id) {
	localdb.init(id);
}
