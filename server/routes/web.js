/**
 * Web pages
 *
 * Author: Yuriy Movchan Date: 11/06/2013
 */

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.render('index', {
			title : 'oxPushServer'
		});
	});
};
