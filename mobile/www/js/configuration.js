/**
 * Configuration
 *
 * Author: Yuriy Movchan Date: 11/27/2013
 */
function oxconf() {}

oxconf.prototype.init = function init(id) {
	// Global variables
	this.oxPushServerUri = 'http://192.168.1.13:3000/oxpush';
	this.androidAppProgramId = '779424896838';
	this.debug = true;
}

var oxconf = new oxconf();

// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady(id) {
	oxconf.init();
}
