const CACHE = '';
var PSPdfKit = require('com.pspdfkit');
if (!Ti.App.Properties.hasProperty('recent'))
	Ti.App.Properties.setString('recent', 'pspdfkit://localhost/StartIndex.pdf');

exports.getPDF = function(_args) {
	var url = (_args.modus == 'start') ? [null, null, 'StartIndex.pdf', 0] : Ti.App.Properties.getString('recent').match(/^pspdfkit:\/\/(.*?)\/(.*?)#page=(.*)/);
	var filename = url[2];
	var page = url[3];
	console.log(url);
	var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, filename);
	if (filehandle.exists()) {
		_args.onload({
			pdfpath : filehandle.nativePath,
			title : 'Übersicht',
			page : page,
			preview : PSPdfKit.imageForDocument(filehandle.nativePath, 0, 1)
		});
	} else {
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				_args.onload({
					pdfpath : filehandle.nativePath,
					title : 'Übersicht',
					page : page,
					preview : PSPdfKit.imageForDocument(filehandle.nativePath, 0, 1)
				});
			}
		});
		xhr.open('GET', Ti.App.Properties.getString('baseurl') + filename);
		xhr.file = filehandle;
		xhr.send();
	}
}

exports.getPdfDocument = function(_url, _pb, _callback) {
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
				_callback(res);
			} catch(E) {
				alert(E);
			}
		}
	}
}

exports.getClientNumber = function(_callback) {
	if (Ti.App.Properties.hasProperty('clientId')) {
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

exports.mirrorAll = function(_argc) {
	function mirrorPDF(pdffile) {
		var xhr = Titanium.Network.createHTTPClient({
			username : Ti.App.Properties.getString('credentials').split(':')[0],
			password : Ti.App.Properties.getString('credentials').split(':')[1],
			ondatastream : function(_e) {
				//	_pb.setValue(_e.progress);
			},
			onerror : function() {
				console.log(this.error);
			},
			onload : function() {
				Ti.App.Properties.setString(pdffile.md5, pdffile.name);
			},
			timeout : 60000
		});
		xhr.open('GET', Ti.App.Properties.getString('baseurl') + pdffile.name);
		xhr.file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, pdffile.name);
		xhr.send(null);
	}


	_argc.onstart();
	var xhr = Ti.Network.createHTTPClient({
		username : Ti.App.Properties.getString('credentials').split(':')[0],
		password : Ti.App.Properties.getString('credentials').split(':')[1],
		onload : function() {
			console.log(xhr.allResponseHeaders);
			var list = JSON.parse(this.responseText);
			for (var i = 0; i < list.length; i++) {
				var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, list[i].name);
				if (filehandle.exists() && !Ti.App.Properties.hasProperty(list[i].md5))
					continue;
				mirrorPDF(list[i]);
			}
		},
		onerror : function() {
			console.log(this.error);
		}
	});
	xhr.open('GET', Ti.App.Properties.getString('baseurl') + '.getallpdfs.php');
	xhr.send();

}
