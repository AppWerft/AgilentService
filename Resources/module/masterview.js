exports.create = function() {
	var self = Ti.UI.createScrollView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		layout : 'horizontal',
		contentWidth : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
	});
	Ti.App.addEventListener('app:updatelist', function() {
		require('module/pdf.model').getlist(function(_lections) {
			if (!_lections)
				return;
			self.removeAllChildren();
			for (var i = 0; i < _lections.length; i++) {
				_lections[i].title = 'Dokument №' + (i + 1);
				self.add(require('module/pdfpreview').create(_lections[i]));
			}
		});
	});
	self.addEventListener('click', function(_e) {
		var item = (_e.source.url) ? _e.source : _e.source.parent;
		if (!item.url)
			return;
		var url = item.url;
		require('module/pdf.model').get(url, item.pb, function(_pdf) {
			Ti.App.PSPDFKIT.showPDF(_pdf.pdfpath, 4, {
				thumbnailBarMode : false,
				top : 50, //  !!!!
				title : null,
				toolbarEnabled : false,
				navigationBarHidden : true,
				lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
				pageMode : 2, // PSPDFPageModeSingle
				pageTransition : 2, // PSPDFPageCurlTransition
				linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
				leftBarButtonItems : ["closeButtonItem"]
				//	additionalBarButtonItems : ["openInButtonItem", "emailButtonItem", "printButtonItem", "searchButtonItem", "outlineButtonItem"]
			}, {
				title : null,
			});
		});
	});
	Ti.App.fireEvent('app:updatelist', {});
	return self;
};
