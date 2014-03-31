/**
 * Holds array of values
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

/**
 * Initialize a new 'ObjectStore'.
 *
 * @api public
 */

var ObjectStore = module.exports = function ObjectStore() {
	this.values = {};
};

/**
 * Attempt to fetch valueent by the given 'id'.
 *
 * @param {String} id
 * @param {Function} fn
 * @api public
 */

ObjectStore.prototype.get = function(id, fn) {
	var self = this;
	process.nextTick(function() {
		var value = self.values[id];
		if (value) {
			fn(null, value);
		} else {
			fn();
		}
	});
};

/**
 * Commit the given 'value' object associated with the given 'id'.
 *
 * @param {String} id
 * @param {value} value
 * @param {Function} fn
 * @api public
 */

ObjectStore.prototype.set = function(id, value, fn) {
	var self = this;
	process.nextTick(function() {
		self.values[id] = value;
		fn && fn();
	});
};

/**
 * Remove the 'value' associated with the given 'id'.
 *
 * @param {String} id
 * @api public
 */

ObjectStore.prototype.remove = function(id, fn) {
	var self = this;
	process.nextTick(function() {
		delete self.values[id];
		fn && fn();
	});
};

/**
 * Invoke the given callback 'fn' with all active values.
 *
 * @param {Function} fn
 * @api public
 */

ObjectStore.prototype.all = function(fn) {
	var arr = [], keys = Object.keys(this.values);
	for (var i = 0, len = keys.length; i < len; ++i) {
		arr.push(this.values[keys[i]]);
	}
	fn(null, arr);
};

/**
 * Clear all values.
 *
 * @param {Function} fn
 * @api public
 */

ObjectStore.prototype.clear = function(fn) {
	this.values = {};
	fn && fn();
};

/**
 * Fetch number of values.
 *
 * @param {Function} fn
 * @api public
 */

ObjectStore.prototype.length = function(fn) {
	fn(null, Object.keys(this.values).length);
};
