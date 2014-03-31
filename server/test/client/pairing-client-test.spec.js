/**
 * Test pairing endpoints.
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

var superagent = require('superagent');

describe('Check pairing server API.', function() {
	var pairing_id = null;
	var pairing_code = null;
	var user_name = 'test_user';
	var application_name = 'gluu_test';

	it('Check server', function(done) {
		superagent.get('http://localhost:3000/oxpush').timeout(2000).set('Accept', 'application/json').end(function(err, response) {
			// console.log(res.body);
			expect(err).toBeNull();
			done();
		});
	});

	it('Start pairing', function(done) {
		superagent.get('http://localhost:3000/oxpush/initialize_pairing/' + application_name + '/' + user_name).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.pairing_id.length).toEqual(36);
					expect(res.body.pairing_code).not.toBeNull();
					expect(res.body.pairing_code.length).toEqual(8);
					expect(res.body.pairing_qr_image).not.toBeNull();

					pairing_code = res.body.pairing_code;
					done();
				});
	});

	it('Validate pairing code', function(done) {
		superagent.get('http://localhost:3000/oxpush/validate_pairing_code/' + pairing_code).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.pairing_id).not.toBeNull();

					pairing_id = res.body.pairing_id;
					done();
				});
	});

	it('Validate pairing code (invalid pairing_code)', function(done) {
		superagent.get('http://localhost:3000/oxpush/validate_pairing_code/' + pairing_code + "_invalid").set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(false);
					expect(res.body.pairing_id).toBeUndefined();
					done();
				});
	});

	it('Check pairing', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_pairing/' + pairing_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.pairing_status).toBe('pending');
					expect(res.body.deployment_id).toBeUndefined();
					done();
				});
	});

	it('Check pairing (invalid pairing_id)', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_pairing/' + pairing_id + "_invalid").set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(false);
					expect(res.body.deployment_id).toBeUndefined();
					done();
				});
	});

	it('Request pairing details', function(done) {
		superagent.get('http://localhost:3000/oxpush/request_pairing_details/' + pairing_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.application_name).toBe(application_name);
					done();
				});
	});

	it('Approve pairing (invalid pairing_id)', function(done) {
		superagent.post('http://localhost:3000/oxpush/approve_pairing/' + pairing_id + '_invalid' + '/true').send({
			'device_token' : '1234-5678',
			'device_type' : 'mobile',
			'os_name' : 'Android',
			'os_version' : '2.3.1'
		}).set('Accept', 'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(false);
			done();
		});
	});

	it('Approve pairing', function(done) {
		superagent.post('http://localhost:3000/oxpush/approve_pairing/' + pairing_id + '/true').send({
			'device_token' : '1234-5678',
			'device_type' : 'mobile',
			'os_name' : 'Android',
			'os_version' : '2.3.1'
		}).set('Accept', 'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(true);
			expect(res.body.deployment_id).not.toBeNull();
			done();
		});
	});

	it('Check pairing', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_pairing/' + pairing_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.pairing_status).toBe('approved');
					expect(res.body.deployment_id).not.toBeNull();
					done();
				});
	});

	it('Approve pairing (try to approve already approved pairing_id)', function(done) {
		superagent.post('http://localhost:3000/oxpush/approve_pairing/' + pairing_id + '/true').send({
			'device_token' : '1234-5678',
			'device_type' : 'mobile',
			'os_name' : 'Android',
			'os_version' : '2.3.1'
		}).set('Accept', 'application/json').end(function(err, res) {
			// console.log(res.body);
			expect(err).toBeNull();
			expect(res.body).not.toBeNull();
			expect(res.body.result).toBe(false);
			expect(res.body.deployment_id).toBeUndefined();
			done();
		});
	});

	it('Check pairing (after 2 approval requests it should return "expired" pairing status)', function(done) {
		superagent.get('http://localhost:3000/oxpush/check_pairing/' + pairing_id).set('Accept', 'application/json').end(
				function(err, res) {
					// console.log(res.body);
					expect(err).toBeNull();
					expect(res.body).not.toBeNull();
					expect(res.body.result).toBe(true);
					expect(res.body.pairing_status).toBe('expired');
					expect(res.body.deployment_id).toBeUndefined();
					done();
				});
	});

});
