exports.create = function() {
	var pspdfkit = require('com.pspdfkit');
	var masterwindow = Ti.UI.createWindow({
		backgroundImage : '/assets/bg.jpg',
	});
	masterwindow.open();
	var masterview = Ti.UI.createScrollView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		layout : 'horizontal',
		contentWidth : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
	});
	masterwindow.add(masterview);
	var mans = [{
		url : 'http://lab.min.uni-hamburg.de/pdf/BrownTreeCutter.pdf‎'
	}, {
		url : 'http://www.enough.de/fileadmin/uploads/dev_guide_pdfs/Guide_11thEdition_WEB-1.pdf'
	}, {
		url : 'http://www.davidgilmour.com/freedom/AGreatDayForFreedom_LITE.pdf'
	}, {
		url : 'http://lab.min.uni-hamburg.de/pdf/PSPDFKit.pdf'
	}, {
		url : 'http://lab.min.uni-hamburg.de/pdf/1.pdf'
	}, {
		url : 'http://lab.min.uni-hamburg.de/pdf/2.pdf'
	}, {
		url : 'http://lab.min.uni-hamburg.de/pdf/Economic Development: Bibb County.pdf'
	}];

	for (var i = 0; i < mans.length; i++) {
		mans[i].title = 'Dokument №' + (i + 1);
		masterview.add(require('module/pdfpreview').create(mans[i]));
	}
	masterview.addEventListener('click', function(_e) {
		var item = (_e.source.url) ? _e.source : _e.source.parent;
		var url = item.url;
		require('module/pdf.model').get(url, function(_pdf) {
			pspdfkit.showPDFAnimated(_pdf.pdfpath);
		});
	});
}
