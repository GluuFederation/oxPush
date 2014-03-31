var GCM = require('gcm').GCM;
var apns = require('apn');

// TODO: Store Android settings in LDAP
var apiKey = 'AIzaSyDo02iN0qnqmw8xjQKhky0K-E71Hr9Di5w';

var gcm = new GCM(apiKey);

//TODO: Store iOS settings in LDAP
var options = {
	cert : 'cert.pem', /* Certificate file path */
	certData : null, /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
	key : 'key.pem', /* Key file path */
	keyData : null, /* String or Buffer containing key data, as certData */
	passphrase : null, /* A passphrase for the Key file */
	ca : null, /* String or Buffer of CA data to use for the TLS connection */
	pfx : null, /* File path for private key, certificate and CA certs in PFX or PKCS12 format. If supplied will be used instead of certificate and key above */
	pfxData : null, /* PFX or PKCS12 format data containing the private key, certificate and CA certs. If supplied will be used instead of loading from disk. */
	gateway : 'gateway.sandbox.push.apple.com', // 'gateway.push.apple.com',/* gateway address */
	port : 2195, /* gateway port */
	rejectUnauthorized : true, /* Value of rejectUnauthorized property to be passed through to tls.connect() */
	enhanced : true, /* enable enhanced format */
	errorCallback : undefined, /* Callback when error occurs function(err,notification) */
	cacheLength : 100, /* Number of notifications to cache for error purposes */
	autoAdjustCache : true, /* Whether the cache should grow in response to messages being lost after errors. */
	connectionTimeout : 0
/* The duration the socket should stay alive with no activity in milliseconds. 0 = Disabled. */
};
var apnsConnection = new apns.Connection(options);

apnsConnection.on('error', function(error) {
	console.log('Error with APN ' + error);
});

apnsConnection.on('transmitted', function(notification) {
	console.log('Notification sent to APN ' + notification.toString());
});

apnsConnection.on('connected', function() {
	console.log('Connected to APN.');
});

apnsConnection.on('disconnected', function() {
	console.log('Disconnected from APN.');
});

apnsConnection.on('transmissionError', function(errorCode, notification) {
	console.log("Transmision error with APN. Error code " + errorCode
			+ " notification: " + notification.toString());
});

var allDevices = [];
var promotionText;

exports.sendAuthenticationMessageToDevice = function (device_configuration, authentication_id) {
	if (!device_configuration.os_name) {
		throw new Error("The OS platform isn't specified");
	}

	if (device_configuration.os_name.toLowerCase() == "ios") {
		var device_token = deployment_entry.device_token;
		var message = 'Authentication request';

		var device = new apns.Device(device_token);
		var note = new apns.Notification();
		note.expiry = Math.floor(Date.now() / 1000) + 60; // Expires in 1 minute from now.
		note.badge = 1;
		note.alert = message;
		note.device = device;

		apnsConnection.sendNotification(note);
	} else if (device_configuration.os_name.toLowerCase() == "android") {
		var device_token = device_configuration.device_token;

		console.error("Registration ID: " + device_token);
		var message = {
			'registration_id' : device_token,
		    'data.message' :  'Authentication request',
	        'data.authentication_id': authentication_id,
		    'data.msgcnt' : 0
		};

		gcm.send(message, function(err, messageId) {
			if (err) {
				console.error("Something has gone wrong with GCM send!", err);
				// TODO: Remove or disable not registered devices 
			} else {
				console.log("Sent message ID: " + messageId + " on GCM.");
			}
		});
	} else {
		throw new Error(util.format("The OS platform '%s' isn't supported",
				deployment_entry.os_name));
	}
};
