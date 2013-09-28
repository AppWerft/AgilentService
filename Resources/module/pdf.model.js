const CACHE = '/documentcache/';

if (!Ti.App.Properties.hasProperty('recent'))
	Ti.App.Properties.setString('recent', 'pspdfkit://localhost/StartIndex.pdf');

exports.getPDF = function(_args) {
	var url = (_args.modus == 'start') ? [null, null, 'StartIndex.pdf', 0] : Ti.App.Properties.getString('recent').match(/^pspdfkit:\/\/(.*?)\/(.*?)#page=(.*)/);
	if (!url)
		return;
	var filename = url[2];
	var page = url[3];
	var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, filename);
	if (filehandle.exists()) {
		_args.onload({
			pdfpath : filehandle.nativePath,
			title : 'Übersicht',
			page : page,
			preview : Ti.App.PSPDFKIT.imageForDocument(filehandle.nativePath, 0, 1)
		});
	} else {
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				_args.onload({
					pdfpath : filehandle.nativePath,
					title : 'Übersicht',
					page : page,
					preview : Ti.App.PSPDFKIT.imageForDocument(filehandle.nativePath, 0, 1)
				});
			}
		});
		xhr.open('GET', Ti.App.Properties.getString('baseurl') + filename);
		xhr.file = filehandle;
		xhr.send();
	}
};

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
					preview : Ti.App.PSPDFKIT.imageForDocument(f.nativePath, 0, 1)
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
							preview : Ti.App.PSPDFKIT.imageForDocument(f.nativePath, 0, 1)
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
					preview : Ti.App.PSPDFKIT.imageForDocument(f.nativePath, 0, 1)
				};
				_callback(res);
			} catch(E) {
				alert(E);
			}
		}
	}
};

exports.getClientNumber = function(_args) {
	if (Ti.App.Properties.hasProperty('clientId')) {
		_args.onsuccess(Ti.App.Properties.getString('clientId'));
	} else {
		var dialog = Ti.UI.createAlertDialog({
			title : 'Kundennummerneingabe',
			style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ['OK']
		});
		dialog.addEventListener('click', function(e) {
			if (e.text == '1234') {
				Ti.App.Properties.setString('clientId', e.text);
				_args.onsuccess(Ti.App.Properties.getString('clientId'))
			}
		});
		dialog.show();
	}
};

exports.mirrorAll = function(_args) {
	var mirrorPDF = function(pdffile) {
		pdffile.title = pdffile.name.replace(/\.pdf/i, '');
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, pdffile.name);
		console.log('path: ' + file.nativePath);
		var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE);
		if (!g.exists()) {
			g.createDirectory();
		};
		_args.onstart(pdffile.title);
		var xhr = Ti.Network.createHTTPClient({
			username : Ti.App.Properties.getString('credentials').split(':')[0],
			password : Ti.App.Properties.getString('credentials').split(':')[1],
			ondatastream : function(_e) {
				_args.onprogress({
					name : pdffile.title,
					progress : _e.progress
				});
			},
			onerror : function(_e) {
				console.log('Error: ' + _e.error + '  ' + pdffile.title);
				Ti.App.Properties.setString(pdffile.md5, pdffile.title);
				_args.onload(pdffile.title);
			},
			onload : function() {
				console.log('Info: ' + this.status + ' ' + pdffile.title + ' loaded.');
				Ti.App.Properties.setString(pdffile.md5, pdffile.title);
				_args.onload(pdffile.title);
			},
			timeout : 60000
		});
		xhr.open('GET', Ti.App.Properties.getString('baseurl') + pdffile.name, true);
		xhr.file = file, xhr.send(null);
	};
	var xhr = Ti.Network.createHTTPClient({
		username : Ti.App.Properties.getString('credentials').split(':')[0],
		password : Ti.App.Properties.getString('credentials').split(':')[1],
		onload : function() {
			var list = JSON.parse(this.responseText);
			for (var i = 0; i < list.length; i++) {
				var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, list[i].name);
				if (filehandle.exists() && Ti.App.Properties.hasProperty(list[i].md5))
					continue;
				console.log(list[i]);
				mirrorPDF(list[i]);
			}
		},
		onerror : function() {
			console.log(this.error);
		}
	});
	xhr.open('GET', Ti.App.Properties.getString('baseurl') + '.getallpdfs.php');
	xhr.send();

};
