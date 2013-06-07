exports.create = function() {
	var pspdfkit = require('com.pspdfkit');
	function updateList() {
		require('module/pdf.model').getlist(function(_lections) {
			masterview.removeAllChildren();
			for (var i = 0; i < _lections.length; i++) {
				_lections[i].title = 'Dokument №' + (i + 1);
				masterview.add(require('module/pdfpreview').create(_lections[i]));
			}
		});
	}

	var renew = Ti.UI.createButton({
		title : 'Reload'
	});
	renew.addEventListener('click', updateList);
	var masterwindow = Ti.UI.createWindow({
		backgroundImage : '/assets/bg.jpg',
		title : 'Lektionen@AgilentService',
		rightNavButton : renew,
		barColor : '#000'
	});
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window : masterwindow,
	});
	var masterview = Ti.UI.createScrollView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		layout : 'horizontal',
		contentWidth : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
	});
	masterwindow.add(masterview);

	updateList();
	masterview.addEventListener('click', function(_e) {
		var item = (_e.source.url) ? _e.source : _e.source.parent;
		if (!item.url)
			return;
		var url = item.url;
		require('module/pdf.model').get(url, function(_pdf) {
			pspdfkit.showPDFAnimated(_pdf.pdfpath);
		});
	});
	var main = Ti.UI.createWindow();
	main.add(navGroup);
	main.open();
}
