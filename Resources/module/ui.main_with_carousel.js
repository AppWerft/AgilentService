exports.create = function() {
	var pspdfkit = require('com.pspdfkit');
	

	var actionbutton = Ti.UI.createButton({
		width : 50,
		height : 36,
		backgroundImage : 'appicon.png',
		borderRadius : 8
	});
	var opts = {
		cancel : 3,
		destructive : 2,
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
					Ti.App.fireEvent('app:updatelist',{});
					break;
				case 1:
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
						console.log('Start killing');
						OpenTok.finishSession();
						console.log('Stop killing, try to remove view');
						OpenTokContainer.remove(opentokview);
						OpenTok = null;
					});

					break;
				case 2:
					var w = Ti.UI.createWindow();w.open();
					var web = Ti.UI.createWebView({
						url : 'update.html'
					});
					w.add(web);
//					Ti.Platform.openURL('http://familientagebuch.de/rainer/img/2013/');
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
	masterwindow.add(require('module/carousel').create());
	var main = Ti.UI.createWindow();
	main.add(navGroup);
	main.open();
}