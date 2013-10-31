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
		console.log(filehandle.nativePath);
		_args.onload({
			pdfpath : filehandle.nativePath,
			title : 'Übersicht',
			page : page
			//preview : Ti.App.PSPDFKIT.imageForDocument(filehandle.nativePath, 0, 1)
		});
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
	var mirrorFile = function(_file) {
		var filename = _file.name;
		var md5 = _file.md5;
		var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE);
		if (!g.exists()) {
			g.createDirectory();
		};
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, filename);
		console.log('path: ' + file.nativePath);
		_args.onstart(filename);
		var xhr = Ti.Network.createHTTPClient({
			username : Ti.App.Properties.getString('credentials').split(':')[0],
			password : Ti.App.Properties.getString('credentials').split(':')[1],
			ondatastream : function(_e) {
				_args.onprogress({
					name : filename,
					progress : _e.progress
				});
			},
			onerror : function(_e) {
				console.log('Error: ' + _e.error + '  ' + filename);
				_args.onload(filename);
			},
			onload : function() {
				console.log('Info: ' + this.status + ' ' + filename + ' loaded.');
				Ti.App.Properties.setString(md5, filename);
				_args.onload(filename);
			},
			timeout : 60000
		});
		var url = Ti.App.Properties.getString('baseurl') + 'DATA/'+filename;
		console.log(url);
		xhr.open('GET', url, true);
		xhr.file = file, xhr.send(null);
	};
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			console.log(this.responseText);
			try {
				var list = JSON.parse(this.responseText);
			} catch(E) {
				return;
			}
			for (var i = 0; i < list.length; i++) {
				console.log('Info: file to mirror: ' + list[i].name);
				var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CACHE, list[i].name);
				if (filehandle.exists() && Ti.App.Properties.hasProperty(list[i].md5))
					continue;
				mirrorFile(list[i]);
			}
		},
		onerror : function() {
			console.log(this.error);
		}
	});
	xhr.open('GET', Ti.App.Properties.getString('baseurl') + '.getallpdfs.php');
	xhr.send();
};
