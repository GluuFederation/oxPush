/**
 * Utility functions.
 * 
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var crypto = require('crypto');

/**
 * Merge object b with object a.
 * 
 * var a = { foo: 'bar' } , b = { bar: 'baz' };
 * 
 * utils.merge(a, b); // => { foo: 'bar', bar: 'baz' }
 * 
 * @param {Object}
 *            a
 * @param {Object}
 *            b
 * @return {Object}
 */

exports.merge = function(a, b) {
	if (a && b) {
		for ( var key in b) {
			a[key] = b[key];
		}
	}
	return a;
};

/**
 * Escape the given string of `html`.
 * 
 * @param {String}
 *            html
 * @return {String}
 */

exports.escape = function(html) {
	return String(html).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;')
			.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/**
 * Respond with 401 "Unauthorized".
 * 
 * @param {ServerResponse}
 *            res
 * @param {String}
 *            realm
 */

exports.unauthorized = function(res, realm) {
	res.statusCode = 401;
	res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
	res.end('Unauthorized');
};

/**
 * Respond with json result: {'result' : false}.
 * 
 * @param {ServerResponse}
 *            res
 */

exports.sendFailedJsonResponse = function(res) {
	res.writeHead(200, {
		'Content-Type' : 'application/json'
	});

	res.end(JSON.stringify({
		'result' : false
	}));
};
/**
 * Respond with json result: {'result' : false}.
 * 
 * @param {ServerResponse}
 *            res
 */

exports.sendJsonResponse = function(res, params) {
	res.writeHead(200, {
		'Content-Type' : 'application/json'
	});

	res.end(JSON.stringify(params));
};

exports.randomHexString = function(size, callback) {
	try {
		var buf = crypto.randomBytes(size);
		if (buf) {
			return buf.toString('hex');
		}
		throw new Error("Test");
	} catch (err) {
		callback && callback(err);
	}

	return null;
};

function noop() {
}
