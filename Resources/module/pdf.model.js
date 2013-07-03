const CACHE = 'PDFs_aus_dem_Neuland';

exports.getPdfDocument = function(_url, _pb, _callback) {
	var PSPdfKit = require('com.pspdfkit');
	var parts = _url.split('/');
	var fileName = parts[parts.length - 1];
	var title = fileName.replace(/\.pdf/i, '');
	if (_url.match(/^http/)) {
		var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE);
		if (!g.exists()) {
			g.createDirectory();
		};
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, fileName);
		_pb.show();
		if (f.exists()) {
			try {
				//PSPdfKit.imageForDocument(f.nativePath, 0, 1);
				var res = {
					pdfpath : f.nativePath,
					title : title,
					preview : PSPdfKit.imageForDocument(f.nativePath, 0, 1)
				};
				console.log(res);
				_callback(res);
			} catch(E) {
				alert(E);
			}
			_pb.hide();
		} else {
			var xhr = Titanium.Network.createHTTPClient({
				ondatastream : function(_e) {
					_pb.setValue(_e.progress);
				},
				onerror : function() {
					_pb.hide();
				},
				onload : function() {
					console.log(this.status + ' ' + _url);
					_pb.hide();
					if (this.status == 200) {
						_callback({
							title : title,
							pdfpath : f.nativePath,
							preview : PSPdfKit.imageForDocument(f.nativePath, 0, 1)
						});
					}
				},
				timeout : 60000
			});
			xhr.open('GET', _url);
			xhr.file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, fileName);
			xhr.send(null);
		}
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, _url);
		if (f.exists()) {
			try {
				//PSPdfKit.imageForDocument(f.nativePath, 0, 1);
				var res = {
					pdfpath : f.nativePath,
					title : title,
					preview : PSPdfKit.imageForDocument(f.nativePath, 0, 1)
				};
				console.log(res);
				_callback(res);
			} catch(E) {
				alert(E);
			}
		}
	}
}

exports.getList = function(_callback) {
	function getClientNumber(_callback) {
		if (Ti.App.Properties.hasProperty('clientId')) {
			console.log('found');
			_callback(Ti.App.Properties.getString('clientId'));

		} else {
			var dialog = Ti.UI.createAlertDialog({
				title : 'Kundennummerneingabe',
				style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
				buttonNames : ['OK']
			});
			dialog.addEventListener('click', function(e) {
				if (e.text == '1234') {
					Ti.App.Properties.setString('clientId', e.text);
					_callback(Ti.App.Properties.getString('clientId'))
				}
			})
			dialog.show();
		}
	}

	getClientNumber(function(_e) {
		var url = Ti.App.Properties.getString('lectionsurl');
		var xhr = Titanium.Network.createHTTPClient({
			onload : function() {
				var list = JSON.parse(this.responseText);
				Ti.App.Properties.setString('pdflist', this.responseText);
				var dirlist = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).getDirectoryListing();
				var regex = /\.pdf$/i;
				for (var i = 0; i < dirlist.length; i++) {
					if (dirlist[i].match(regex)) {
						list.push({
							url : dirlist[i],
							local : true
						});
					}
				}
				console.log(list);
				_callback(list);
			},
			timeout : 120000
		});
		xhr.open('GET', url);
		xhr.send(null);
	});

};

