exports.create = function() {
	require('module/pdf.model').getClientNumber(function() {
		var progressdisplay;
		require('module/pdf.model').mirrorAll({
			onstart : function() {
				progressdisplay = Ti.UI.iPad.createPopover({
					width : 480,
					height : 20,
					title : 'Progress',
				});
				progressdisplay.show();
			},
			onprogress : function() {
			},
			onend : function() {
				progressdisplay.hide();
			}
		});
		var pspdfkit = require('com.pspdfkit');
		var pdfcontroler;
		function updateList() {
			require('module/pdf.model').getList(function(_lections) {
				if (!_lections)
					return;
				masterview.removeAllChildren();
				for (var i = 0; i < _lections.length; i++) {
					//_lections[i].title = 'Dokument №' + (i + 1);
					masterview.add(require('module/pdfpreview').create(_lections[i]));
				}
			});
		}

		function openPDF(_modus) {
			require('module/pdf.model').getPDF({
				modus : _modus,
				onload : function(_pdf) {
					pdfcontroler = pspdfkit.showPDFAnimated(_pdf.pdfpath, 4, {
						lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
						pageMode : 0, // PSPDFPageModeSingle
						pageTransition : 2, // PSPDFPageCurlTransition
						linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
						thumbnailSize : [200, 200], // Allows custom thumbnail size.
						leftBarButtonItems : ["closeButtonItem"],
						top : 50
					}, {
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
			});
		}

		var actionbutton = Ti.UI.createButton({
			width : 50,
			height : 36,
			backgroundImage : 'appicon.png',
			borderRadius : 8
		});
		var opts = {
			cancel : 4,
			destructive : 0,
			options : [' ►  S T A R T    ', 'Letztes Kapitel', 'Meldungen', '✱ Videokonferenz ✱ ', 'Abbruch'],
			selectedIndex : 1,
			title : 'Optionen'
		};
		var masterwindow = Ti.UI.createWindow({
			backgroundImage : '/assets/bg.jpg',
			title : 'iLabDoc',
			rightNavButton : actionbutton,
			backgroundColor : 'silver',
			barColor : '#000'
		});
		var navGroup = Ti.UI.iPhone.createNavigationGroup({
			window : masterwindow,
		});
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.addEventListener('click', function(_e) {
			switch (_e.index) {
				case 0:
					if (main.tv) {
						main.remove(main.tv);
						main.tv = null;
					}
					openPDF('start');
					break;
				case 1:
					openPDF('recent');
					if (main.tv) {
						main.remove(main.tv);
						main.tv = null;
					}
					break;
				case 2:
					main.tv = Ti.UI.createTableView({
						top : 50,

						left : 10,
						right : 10,
						borderRadius : 8,
						transform : Ti.UI.create2DMatrix({
							scale : 0.01
						}),
						borderWidth : 3,
						opacity : 0,
						borderColor : 'gray'
					});
					masterwindow.add(main.tv);
					require('module/heiseticker.model').get({
						url : 'http://www.heise.de/newsticker/heise-atom.xml',
						onload : function(_items) {
							var rows = [];
							for (var i = 0; i < _items.length; i++) {
								var row = Ti.UI.createTableViewRow({
									hasChild : true,
									layout : 'vertical',
									link : _items[i].link.text
								});
								row.add(Ti.UI.createLabel({
									text : _items[i].title.text,
									width : Ti.UI.FILL,
									left : 10,
									font : {
										fontWeight : 'bold',
										fontSize : '20pt'
									},
									top : 10
								}));
								row.add(Ti.UI.createLabel({
									text : _items[i].description.text.replace(/<(.*?)>/gi, ''),
									width : Ti.UI.FILL,
									color : '#444',
									left : 10,
									top : 5,
									font : {
										fontSize : '14pt'
									},
								}))
								rows.push(row);
							}
							main.tv.setData(rows);
							main.tv.addEventListener('click', function(_e) {
								var win = Ti.UI.createWindow();
								var m = require('tv.harukaze.ti.webviewuseragent.ios');
								m.setWebViewUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3');
								var web = Ti.UI.createWebView({
									url : _e.rowData.link,
									disableBounce : true,
									navBarHidden : true
								});
								win.add(web);
								win.addEventListener('longpress', function() {
									win.close();
								})
								win.open({
									modal : true
								});
							});
						}
					});
					main.tv.animate({
						opacity : 0.9,
						transform : Ti.UI.create2DMatrix({
							scale : 1,
							duration : 5000
						})
					});
					break;
				case 3:
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
		var main = Ti.UI.createWindow();
		main.add(navGroup);
		main.open();
		actionbutton.fireEvent('click');
	});
}
