/**
 * Page methods
 *
 * Author: Yuriy Movchan Date: 11/22/2013
 */
function Page() {}

Page.prototype.init = function init(id) {
	page.refreshPairingLink();
	page.refreshManageLink();
	page.initManagePageTemplates();
	page.currentPage = '#home-page';

	$(document).on({
		'pagebeforeshow' : function() {
		}
	}, '#home-page');

	$(document).on({
		'pagebeforeshow' : function() {
			page.pairResetForm();
		}
	}, '#pair-page');

	$(document).on({
		'pagebeforeshow' : function() {
		}
	}, '#manage-page');

	$(document).on({
		'pagebeforeshow' : function() {
		}
	}, '#home-page');

	$(document).bind('pagebeforechange', function(evt, data) {
		if (typeof data.toPage === 'string') {
			var url = $.mobile.path.parseUrl(data.toPage);

			var managePageRe = /^#manage-page$/;
			if (url.hash.search(managePageRe) !== -1) {
				page.showManagePage();

				// Make sure to tell changePage() we've handled this call so it doesn't have to do anything
				evt.preventDefault();
			}
		}
	});
	
	$(window).hashchange(function() {
		var url = $.mobile.path.parseUrl(window.location.href);
	    var currentPageRe = /^#.+-page$/;
		var currentPageMatch = url.hash.match(currentPageRe);
		if (currentPageMatch && currentPageMatch.length > 0) {
			page.currentPage = currentPageMatch[0];
		} else {
			page.currentPage = '#home-page';
		}
	});
}

Page.prototype.enableLink = function enableLink(linkSelector, state) {
	var enabled = !$(linkSelector).hasClass('ui-disabled');

	if (enabled == state) {
		return;
	}

	if (state) {
		$(linkSelector).removeClass('ui-disabled');
	} else {
		$(linkSelector).addClass('ui-disabled');
	}
}

Page.prototype.refreshPairingLink = function refreshPairingLink() {
	var hasPushNotificationRegistrationId = localdb.getPushNotificationRegistrationId() != null;
	this.enableLink('#linkPairPage', hasPushNotificationRegistrationId);
}

Page.prototype.refreshManageLink = function refreshManageLink() {
	var hasDeployments = localdb.hasDeployments();
	this.enableLink('#linkManagePage', hasDeployments);
}

Page.prototype.showPage = function showPage(pageSelector, changeHash) {
	$.mobile.changePage(pageSelector, {
		transition : 'pop',
		changeHash : changeHash,
		role : 'page'
	});
}

Page.prototype.showDialog = function showDialog(dialogSelector, changeHash) {
	$.mobile.changePage(dialogSelector, {
		transition : 'pop',
		changeHash : changeHash,
		role : 'dialog'
	});
}

Page.prototype.showPopup = function showPopup(statusText) {
	var popupSelector = page.currentPage + "-popup";
	var statusTextSelector = popupSelector + "-text";

	var statusElement = $(statusTextSelector);
	statusElement.text(statusText);

	$(popupSelector).popup('open');

	setTimeout(function() {
		$(popupSelector).popup('close');
	}, 5000);
}

Page.prototype.setElementText = function setElementText(id, text) {
	$('#' + id).text(text);
}

Page.prototype.pairResetForm = function pairResetForm() {
	page.pairingId = null;
	page.pairingDetails = null;
	$('#txtPairingCode').val('');
}

Page.prototype.scanQRCode = function scanQRCode() {
	var self = this;

	cordova.plugins.barcodeScanner.scan(function(result) {
		if (!result.cancelled && ('QR_CODE' == result.format) && (result.text != '')) {
			var pairingCodeText = 'pairing_code:';
			var regexPairingCode = new RegExp('^' + pairingCodeText + '.+');
			var resultText = result.text;
			if (regexPairingCode.test(resultText)) {
				var pairingCode = resultText.substring(pairingCodeText.length, resultText.lenght);
				$('#txtPairingCode').val(pairingCode);
			}
		}
	}, function(er) {
		self.debug('Failed to scan QR code: ' + err);
		self.showPopup('Failed to scan QR code');
	});
}

Page.prototype.validatePairingCode = function validatePairingCode() {
	var self = this;

	var pairingCode = $('#txtPairingCode').val();
	if (pairingCode && pairingCode != '') {
		oxserver.validatePairingCode(pairingCode, function(pairingId) {
			if (pairingId == null) {
				self.showPopup('Failed to validate pairing code');
			} else {
				self.showPairDetailsDialog(pairingId);
			}
		});
	}
}

Page.prototype.showPairDetailsDialog = function showPairDetailsDialog(id) {
	var self = this;

	self.pairingId = id;
	if (self.pairingId && (self.pairingId != '')) {
		oxserver.getPairingDetails(self.pairingId, function(data) {
			if (data) {
				self.pairingDetails = data;

				var pairing_time = new Date(data.pairing_time);
				var fomattedPairingTime = pairing_time.getHours() + ':' + pairing_time.getMinutes() + ':' + pairing_time.getSeconds();

				self.setElementText('pUser', data.user_name);
				self.setElementText('pApplication', data.application_name);
				self.setElementText('pDescription', data.application_description);
				self.setElementText('pIpAddress', data.application_ip);
				self.setElementText('pTime', fomattedPairingTime);

				self.showDialog('#pair-dialog', false);
			} else {
				self.showPopup('Failed to pair');
			}
		});
	}
}

Page.prototype.pair = function pair(pairResult) {
	var self = this;

	var pushNotificationRegistrationId = localdb.getPushNotificationRegistrationId();
	if (pushNotificationRegistrationId == null) {
		self.showPopup('Failed to register for push notifications', "#home-page");

		return;
	}

	oxserver.pairDevice(self.pairingId, pairResult, pushNotificationRegistrationId, function(result, deploymentId) {
		if (result) {
			if (pairResult) {
				self.showPopup('Paired with site', "#home-page");

				localdb.addDeployment(deploymentId, self.pairingDetails);
			} else {
				self.showPopup('Declined pairing request', "#home-page");
			}

			self.refreshManageLink();
		} else {
			self.showPopup('Failed to pair with site', "#home-page");
		}
	});
}

Page.prototype.showAuthenticateDetailsDialog = function showAuthenticateDetailsDialog(id) {
	var self = this;

	self.authenticationId = id;
	if (self.authenticationId && (self.authenticationId != '')) {
		oxserver.getAuthenticationDetails(self.authenticationId, function(data) {
			if (data) {
				var authenticationTime = new Date(data.authentication_time);
				var fomattedAuthenticationTime = authenticationTime.getHours() + ':' + authenticationTime.getMinutes() + ':'
						+ authenticationTime.getSeconds();

				self.setElementText('aUser', data.user_name);
				self.setElementText('aApplication', data.application_name);
				self.setElementText('aDescription', data.application_description);
				self.setElementText('aIpAddress', data.application_ip);
				self.setElementText('aTime', fomattedAuthenticationTime);

				self.showDialog('#authenticate-dialog', true);
			} else {
				self.showPopup('Failed to authenticate');
			}
		});
	}
}

Page.prototype.authenticate = function authenticate(authenticateResult) {
	var self = this;
	oxserver.authenticateDevice(self.authenticationId, authenticateResult, function(result) {

		if (result) {
			if (authenticateResult) {
				self.showPopup('Authenticated');
			} else {
				self.showPopup('Declined authentication request');
			}
		} else {
			self.showPopup('Failed to authenticate');
		}
	});
}

Page.prototype.initManagePageTemplates = function initManagePageTemplates() {
	var page = $('#manage-page');
	var content = page.children(':jqmData(role=content)');
	this.managePageButtonTemplate = content.find('div').html();
	this.managePageListTemplate = content.find('ul').html();
}

Page.prototype.showManagePage = function showManagePage() {
	var hasDeployments = localdb.hasDeployments();

	var page = $('#manage-page');
	var content = page.children(':jqmData(role=content)');

	var markup = '<ul data-role="listview" data-split-theme="d" data-split-icon="delete" data-inset="true">';
	if (hasDeployments) {
		var deployments = localdb.getDeployments();
		for (var i = 0; i < deployments.length; i++) {
			var deployment = deployments[i];

			var template = new String(this.managePageListTemplate);
			markup += template.replace(/\$SITE_NAME/g, deployment.application_name).replace(/\$USER_NAME/g, deployment.user_name).replace(
					/\$DEPLOYMENT_IDX/g, deployment.deployment_idx);
		}
	}

	markup += '</ul>';
	markup += '<div align="center">' + this.managePageButtonTemplate;
	+'</div>'

	// Inject the category items markup into the content element
	content.html(markup);

	// Pages are lazily enhanced. We call page() on the page element to make sure it is always enhanced before we
	// attempt to enhance the listview markup we just injected. Subsequent calls to page() are ignored since a page/widget
	// can only be enhanced once
	page.page();

	// Enhance the content we just injected
	content.trigger('create');

	// Now call changePage() and tell it to switch to the page we just modified
	this.showPage(page, true);
}

Page.prototype.showDeploymentDialog = function showDeploymentDialog(deploymentIdx) {
	var self = this;

	var deployment = localdb.getDeployment(deploymentIdx);
	if (deployment == null) {
		self.showPopup('Failed to load site details');
		return;
	}

	var authenticationTime = new Date(deployment.server_pairing_time);
	var fomattedAuthenticationTime = authenticationTime.getHours() + ':' + authenticationTime.getMinutes() + ':'
			+ authenticationTime.getSeconds();
	self.setElementText('dUser', deployment.user_name);
	self.setElementText('dApplication', deployment.application_name);
	self.setElementText('dDescription', deployment.application_description);
	self.setElementText('dIpAddress', deployment.application_ip);
	self.setElementText('dTime', fomattedAuthenticationTime);

	self.currentDeploymentIdx = deploymentIdx;

	self.showDialog('#deployment-dialog', false);
}

Page.prototype.deleteDeployment = function deleteDeployment(deploymentIdx) {
	var self = this;

	var deployment = localdb.getDeployment(deploymentIdx);
	if (deployment == null) {
		self.showPopup('Failed to load site details');
		return;
	}

	if (deployment != null) {
		oxserver.deleteDeployment(deployment.deployment_id, function(result) {
			if (result) {
				localdb.deleteDeployment(deployment.deployment_idx);
				self.showPopup('Successfully deleted site');
			} else {
				self.showPopup('Failed to delete site');
			}

			self.refreshManageLink();
		});
	}
}

Page.prototype.deleteCurrentDeployment = function deleteCurrentDeployment() {
	this.deleteDeployment(this.currentDeploymentIdx);
}

Page.prototype.addStatusMessage = function addStatusMessage(msg, log) {
	if (oxconf.debug) {
		$('#app-status-ul').append('<li>' + msg + '</li>');
	}

	if (log) {
		this.debug(msg);
	}
}

Page.prototype.debug = function debug(message) {
	if (oxconf.debug) {
		console.log('oxPush: ' + message);
	}
}

var page = new Page();

// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady(id) {
	page.init(id);
}
