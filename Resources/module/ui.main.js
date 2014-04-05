const INLINE = true;
const HOMEBUTTON = false;
exports.create = function() {
	var pdfcontroler;
	var menubutton = Ti.UI.createButton({
		title : 'Menü'
	});
	var self = Ti.UI.iOS.createNavigationWindow({
		window : Ti.UI.createWindow({
			backgroundImage : '/assets/bg.jpg',
			title : '',
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			rightNavButton : menubutton,
			barColor : '#555',
			fullscreen : false,
			leftNavButton : null
		})
	});
	self.open();

	var homebutton = Ti.UI.createButton({
		title : 'Home',
		width : 80,
		height : 35
	});
	if (HOMEBUTTON)
		homebutton.addEventListener('click', function() {
			pdfcontroler && self.getWindow().remove(pdfcontroler);
		});

	require('module/pdf.model').getClientNumber({
		onsuccess : function(_backgroundURL) {
			self.getWindow().add(Ti.UI.createImageView({
				image : _backgroundURL,
				defaultImage : '',
				width : Ti.UI.FILL,
				height : Ti.UI.FILL
			}));
			console.log('Info: getClientNumber successful');
			require('module/mirror').all();
			function updateList() {
				require('module/pdf.model').getList(function(_lections) {
					if (!_lections)
						return;
					self.getWindow().removeAllChildren();
				});
			}

			function openPDF(_modus) {
				if (HOMEBUTTON)
					self.getWindow().leftNavButton = homebutton;
				require('module/pdf.model').getPDF({
					modus : _modus,
					onload : function(_pdf) {
						var options = {
							lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
							thumbnailBarMode : 0,
							pageMode : 0, // PSPDFPageModeSingle
							top : 0,
							pageLabelEnabled :false,
							toolbarEnabled : false,
							pageTransition : 2, // PSPDFPageCurlTransition
							linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
							leftBarButtonItems : [],
							rightBarButtonItems : [],
						};
						if (INLINE == true) {
							pdfcontroler = Ti.App.PSPDFKIT.createView({
								filename : _pdf.pdfpath,
								top : 0,
								options : options,
								documentOptions : {
									title : ''
								}
							});
							self.getWindow().add(pdfcontroler);
							pdfcontroler.scrollToPage(_pdf.page, true);
							pdfcontroler.addEventListener('didShowPage', function(_event) {
								var path = _pdf.pdfpath;
								var value = 'pspdfkit://localhost/' + path[path.length - 1] + '#page=' + _event.page;
								Ti.App.Properties.setString('recent', value);
							});
							pdfcontroler.addEventListener('didCloseController', function() {
								mainWindow.remove(pdfcontroler);
								dialog.show({
									view : menubutton
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
									view : menubutton
								});
							});
						}
					}
				});
			}

			var opts = {
				cancel : 2,
				options : ['  S T A R T    ', 'Datenabgleich', 'Abbruch'],
				title : 'Version: ' + Ti.App.getVersion()
			};
			var dialog = Ti.UI.createOptionDialog(opts);
			dialog.addEventListener('click', function(_e) {
				switch (_e.index) {
					case 0:
						openPDF('start');
						break;

					case 1:
						require('module/mirror').all();
						break;
				}
			});
			menubutton.addEventListener('click', function() {
				dialog.show({
					view : menubutton
				});
			});
			menubutton.fireEvent('click');
		}
	});
	//	Ti.App.addEventListener('resume', require('module/mirror').all());
};
