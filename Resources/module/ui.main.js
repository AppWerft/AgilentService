exports.create = function() {
	var pspdfkit = require('com.pspdfkit');
	function updateList() {
		require('module/pdf.model').getlist(function(_lections) {
			if (!_lections)
				return;
			masterview.removeAllChildren();
			for (var i = 0; i < _lections.length; i++) {
				_lections[i].title = 'Dokument №' + (i + 1);
				masterview.add(require('module/pdfpreview').create(_lections[i]));
			}
		});
	}

	var actionbutton = Ti.UI.createButton({
		width : 50,
		height : 36,
		backgroundImage : 'appicon.png',
		borderRadius : 8
	});
	var opts = {
		cancel : 2,
		options : ['Lektionen aktualisieren', 'Videokonferenz', 'Abbruch'],
		selectedIndex : 1,
		title : 'Optionen'
	};
	actionbutton.addEventListener('click', function() {
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show({
			view : actionbutton
		});
		dialog.addEventListener('click', function(_e) {
			switch (_e.index) {
				case 0:
					updateList()
					break;
				case 1:
					var popover = Ti.UI.iPad.createPopover({
						width : 480,
						height : 540,
						title : 'Videokonferenz',
					});
					var OpenTokView = require('module/opentok_view');
					popover.add(new OpenTokView());
					popover.show({
						view : actionbutton
					});
					break;
			}
		});
	});

	var masterwindow = Ti.UI.createWindow({
		backgroundImage : '/assets/bg.jpg',
		title : 'Lektionen@AgilentService',
		rightNavButton : actionbutton,
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
		require('module/pdf.model').get(url, item.pb, function(_pdf) {
			pspdfkit.showPDFAnimated(_pdf.pdfpath, 4, {
				lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
				pageMode : 0, // PSPDFPageModeSingle
				pageTransition : 2, // PSPDFPageCurlTransition
				linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
				thumbnailSize : [200, 200], // Allows custom thumbnail size.
				leftBarButtonItems : ["closeButtonItem"]
				//	additionalBarButtonItems : ["openInButtonItem", "emailButtonItem", "printButtonItem", "searchButtonItem", "outlineButtonItem"]
			}, {
				//title : "Titel der Lektion",
			});
		});
	});
	var main = Ti.UI.createWindow();
	main.add(navGroup);
	main.open();
}
