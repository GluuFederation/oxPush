/**
 * Push notification methods
 *
 * Author: Yuriy Movchan Date: 11/27/2013
 */
function Push() {}

Push.prototype.init = function init(id) {
	this.registerPushNotificationEvent();
}

// Handle Android notification messages
Push.prototype.onNotificationGCM = function onNotificationGCM(evt) {
	page.addStatusMessage('GCM event: ' + evt.event, true);

	switch (evt.event) {
	case 'registered':
		if (evt.regid.length > 0) {
			localdb.setPushNotificationRegistrationId(evt.regid);
			page.refreshPairingLink();
		}
		break;
	case 'message':
		this.debug('Recieve GCM message');
		// If this flag is set, this notification happened while we were in the foreground.
		// You might want to play a sound to get the user's attention, throw up a dialog, etc.
		if (evt.foreground) {
			page.addStatusMessage('GCM inline notification', true);

			// If the notification contains a soundname, play it.
			if (evt.soundname != null) {
				var my_media = new Media('/android_asset/www/' + evt.soundname);
				my_media.play();
			}
		} else {
			// Otherwise we were launched because the user touched a notification in the notification tray.
			if (evt.coldstart) {
				page.addStatusMessage('GCM coldstart notification', true);
			} else {
				page.addStatusMessage('GCM background notification', true);
			}
		}

		page.showAuthenticateDetailsDialog(evt.payload.authentication_id);
		break;
	case 'error':
		page.addStatusMessage('GCM error: ' + evt.msg, true);
		break;

	default:
		page.addStatusMessage('Unknown, an event was received and we do not know what it is', true);
		break;
	}
}

// Handle iOS notification messages
Push.prototype.onNotificationAPN = function onNotificationAPN(event) {
	if (event.alert) {
		navigator.notification.alert(event.alert);
	}

	if (event.sound) {
		var snd = new Media(event.sound);
		snd.play();
	}

	if (event.badge) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
	}
}

// Handlers
Push.prototype.successHandler = function successHandler(result) {
	page.addStatusMessage('Success: ' + result);
}

Push.prototype.errorHandler = function errorHandler(error) {
	page.addStatusMessage('Error: ' + error);
}

Push.prototype.tokenHandler = function tokenHandler(token) {
	page.addStatusMessage('Token: ' + error);

	var regid = token.toString(16);
	localdb.setPushNotificationRegistrationId(regid);
	page.refreshPairingLink();
}

// Register for push notifications
Push.prototype.registerPushNotificationEvent = function registerPushNotificationEvent() {
	localStorage = window.localStorage;
	pushNotification = window.plugins.pushNotification;

	try {
		if ((device.platform == 'android') || (device.platform == 'Android')) {
			page.addStatusMessage('Registering Android for push notifications', true);

			pushNotification.register(push.successHandler, push.errorHandler, {
				senderID : oxconf.androidAppProgramId,
				ecb : 'push.onNotificationGCM'
			});
		} else {
			page.addStatusMessage('Registering iOS for push notifications', true);

			pushNotification.register(push.tokenHandler, push.errorHandler, {
				badge : true,
				sound : true,
				alert : true,
				ecb : 'push.onNotificationAPN'
			});
		}
	} catch (err) {
		page.addStatusMessage('Failed to register for push notifications', false);
		this.debug('Failed to register for push notifications: ' + err.message);

		throw err;
	}
}

Push.prototype.debug = function debug(message) {
	if (oxconf.debug) {
		console.log('oxPush: ' + message);
	}
}

var push = new Push();

// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady(id) {
	push.init(id);
}
