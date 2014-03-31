/**
 * Test deploymnet endpoints.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var superagent = require('superagent');

describe('Check deployment server API.', function() {
	var deployment_id = 'c61a85d0-453f-11e3-b52e-ed6cfb0fb7da';

	it('Check server', function(done) {
		superagent.get('http://localhost:3000/oxpush').timeout(2000).set('Accept', 'application/json').end(function(err, response) {
			// console.log(res.body);
			expect(err).toBeNull();
			done();
		});
	});

	it('Check deployment', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_deployment/' + deployment_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					done();
				});
	});
});
