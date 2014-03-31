/**
 * Logging functions.
 *
 * Author: Yuriy Movchan Date: 11/07/2013
 */

var fs = require('fs');

exports.prepareLogFolder = function() {
	var existsLogFolder = fs.existsSync('log');
	if (!existsLogFolder) {
		fs.mkdirSync('log');
	}
};
