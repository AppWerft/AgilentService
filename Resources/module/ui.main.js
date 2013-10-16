const INLINE = true;
exports.create = function() {
	var actionbutton = Ti.UI.createButton({
		width : 50,
		height : 36,
		backgroundImage : 'appicon.png',
		borderRadius : 8
	});

	var masterwindow = Ti.UI.createWindow({
		backgroundImage : '/assets/bg.jpg',
		title : 'iLabDoc',
		rightNavButton : actionbutton,
		backgroundColor : 'silver',
		barColor : '#000'
	});
	var closer = Ti.UI.createButton({
		title : 'Schliessen',
		width : 80,
		height : 25
	});
	closer.addEventListener('click', function() {
		pdfcontroler && pdfcontroler.close();
	});
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window : masterwindow,
	});
	var mainWindow = Ti.UI.createWindow({
		leftNavButton : closer
	});
	mainWindow.add(navGroup);
	mainWindow.open();
	var pdfcontroler;
	require('module/pdf.model').getClientNumber({
		onsuccess : function() {
			var pspdfkit = require('com.pspdfkit');

			require('module/mirror').all();
			function updateList() {
				require('module/pdf.model').getList(function(_lections) {
					if (!_lections)
						return;
					masterview.removeAllChildren();
					for (var i = 0; i < _lections.length; i++) {
						masterview.add(require('module/pdfpreview').create(_lections[i]));
					}
				});
			}

			function openPDF(_modus) {
				require('module/pdf.model').getPDF({
					modus : _modus,
					onload : function(_pdf) {
						var options = {
							lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
							thumbnailBarMode : 0,
							pageMode : 0, // PSPDFPageModeSingle
							top : 40,
							pageTransition : 2, // PSPDFPageCurlTransition
							linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
							leftBarButtonItems : [],
							rightBarButtonItems : [],
						};
						if (INLINE == true) {
							pdfcontroler = pspdfkit.createView({
								filename : _pdf.pdfpath,
								top : 50,
								options : options,
								documentOptions : {
									title : ''
								}
							});
							mainWindow.add(pdfcontroler);
							pdfcontroler.scrollToPage(_pdf.page, true);
							pdfcontroler.addEventListener('didShowPage', function(_event) {
								var path = _pdf.pdfpath;
								var value = 'pspdfkit://localhost/' + path[path.length - 1] + '#page=' + _event.page;
								Ti.App.Properties.setString('recent', value);
							});
							pdfcontroler.addEventListener('didCloseController', function() {
								mainWindow.remove(pdfcontroler);
								dialog.show({
									view : actionbutton
								});
							});
						} else {
							pdfcontroler = pspdfkit.showPDFAnimated(_pdf.pdfpath, 4, options, {
							});
							pdfcontroler.scrollToPage(_pdf.page, true);
							pdfcontroler.addEventListener('didShowPage', function(_event) {
								var path = pdfcontroler.documentPath.split('/');
								var value = 'pspdfkit://localhost/' + path[path.length - 1] + '#page=' + _event.page;
								Ti.App.Properties.setString('recent', value);
							});
							pdfcontroler.addEventListener('didCloseController', function() {
								dialog.show({
									view : actionbutton
								});
							});
						}
					}
				});
			}

			var opts = {
				cancel : 2,
				destructive : 0,
				options : [' ►  S T A R T    ', '¦  Letztes Kapitel', 'Abbruch'],
				selectedIndex : 1,
				title : 'Haupt-Menü'
			};
			var dialog = Ti.UI.createOptionDialog(opts);
			dialog.addEventListener('click', function(_e) {
				switch (_e.index) {
					case 0:
						openPDF('start');
						break;
					case 1:
						openPDF('recent');
						break;
					case 2:
						var OpenTokModul = require('module/opentok_view');
						var OpenTokContainer = Ti.UI.iPad.createPopover({
							width : 480,
							height : 540,
							title : 'Videokonferenz',
						});
						OpenTokContainer.show({
							view : actionbutton
						});
						var OpenTok = new OpenTokModul();
						var opentokview = OpenTok.getView();
						OpenTokContainer.add(opentokview);
						OpenTokContainer.addEventListener('hide', function() {
							OpenTok.finishSession();
							OpenTokContainer.remove(opentokview);
							OpenTok = null;
						});
						break;
				}
			});
			actionbutton.addEventListener('click', function() {
				dialog.show({
					view : actionbutton
				});
			});
			actionbutton.fireEvent('click');
		}
	});
	Ti.App.addEventListener('resume', require('module/mirror').all());
};
