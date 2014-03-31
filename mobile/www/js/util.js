$.fn.center = function() {
	this.css('position', 'absolute');
	this.css('top', ($(window).height() - this.height()) / 2 + 'px');
	this.css('left', ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + 'px');
	return this;
}

function deleteArrayElement(array, value) {
	for (var i = array.length - 1; i >= 0; i--) {
		if (array[i] === value) {
			array.splice(i, 1);
		}
	}
}

function urlencode(str) {
	str = (str + '').toString();
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g,
			'%2A').replace(/%20/g, '+');
}
