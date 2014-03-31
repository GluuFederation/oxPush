/**
 * Test authentication endpoints.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var superagent = require('superagent');

describe('Check authentication server API.', function() {
	var deployment_id = 'c61a85d0-453f-11e3-b52e-ed6cfb0fb7da';
	var user_name = 'test';
	var application_name = 'gluu_test';
	var authentication_id = null;

	it('Check server', function(done) {
		superagent.get('http://localhost:3000/oxpush').timeout(2000).set('Accept', 'application/json').end(function(err, response) {
			// console.log(res.body);
			expect(err).toBeNull();
			done();
		});
	});

	it('Start authentication', function(done) {
		superagent.get('http://localhost:3000/oxpush/authenticate/' + deployment_id + "/" + user_name).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.authentication_id.length).toEqual(36);
					authentication_id = res.body.authentication_id;
					done();
				});
	});

	it('Check authentication', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_authentication/' + authentication_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.authentication_status).toBe('pending');
					done();
				});
	});

	it('Check authentication (invalid authentication_id)', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_authentication/' + authentication_id + "_invalid").set('Accept',
				'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(false);
			done();
		});
	});
	it('Request authentication details', function(done) {
		superagent.get('http://localhost:3000/oxpush/request_authentication_details/' + authentication_id)
				.set('Accept', 'application/json').end(function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.application_name).toBe(application_name);
					done();
				});
	});

	it('Approve authentication (invalid authentication_id)', function(done) {
		superagent.get('http://localhost:3000/oxpush/approve_authentication/' + authentication_id + '_invalid' + '/true').set('Accept',
				'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(false);
			done();
		});
	});

	it('Approve authentication', function(done) {
		superagent.get('http://localhost:3000/oxpush/approve_authentication/' + authentication_id + '/true').set('Accept',
				'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(true);
			done();
		});
	});

	it('Check authentication', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_authentication/' + authentication_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.authentication_status).toBe('approved');
					done();
				});
	});

	it('Approve authentication (try to approve already approved authentication_id)', function(done) {
		superagent.get('http://localhost:3000/oxpush/approve_authentication/' + authentication_id + '/true').set('Accept',
				'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(false);
			done();
		});
	});

	it('Check authentication (after 2 approval requests it should return "expired" authentication status)', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_authentication/' + authentication_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.authentication_status).toBe('expired');
					expect(res.body.deployment_id).toBeUndefined();
					done();
				});
	});

});
