if (!Ti.App.Properties.hasProperty('recent'))
	Ti.App.Properties.setString('recent', 'pspdfkit://localhost/StartIndex.pdf');

Array.prototype.in_array = function(p_val) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (this[i] == p_val) {
			return true;
		}
	}
	return false;
};
Array.prototype.in_filearray = function(p_val) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (this[i].name == p_val) {
			return true;
		}
	}
	return false;
};

exports.getPDF = function(_args) {
	var url = (_args.modus == 'start') ? [null, null, 'StartIndex.pdf', 0] : Ti.App.Properties.getString('recent').match(/^pspdfkit:\/\/(.*?)\/(.*?)#page=(.*)/);
	if (!url)
		return;
	var filename = url[2];
	var page = url[3];
	var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
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

exports.getClientBG = function() {
	return Ti.App.Properties.getString('baseurl') + 'FINAL_DATA/KUNDENLOGOS/' + Ti.App.Properties.getString('clientId') + '.jpg';
};

exports.getClientNumber = function(_args) {
	var props = Ti.App.Properties.listProperties();
	for (var i = 0, ilen = props.length; i < ilen; i++) {
		var value = Ti.App.Properties.getString(props[i]);
		Ti.API.info(props[i] + ' = ' + value);
	}
	if (Ti.App.Properties.getBool('nrsaving') == false)
		Ti.App.Properties.removeProperty('clientId');
	console.log('Info: start getClientNumber');
	if (Ti.App.Properties.hasProperty('clientId')) {
		console.log('Info: ClientNumber from Storage');
		var bgurl = Ti.App.Properties.getString('baseurl') + 'FINAL_DATA/KUNDENLOGOS/' + Ti.App.Properties.getString('clientId') + '.jpg';
		_args.onsuccess(bgurl);
	} else {
		var dialog = Ti.UI.createAlertDialog({
			title : 'Kundennummerneingabe',
			style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ['OK']
		});
		dialog.addEventListener('click', function(e) {
			if (e.text == '1234') {
				Ti.App.Properties.setString('clientId', e.text);
				console.log('Info: ClientNumber saved into storage');
				_args.onsuccess(Ti.App.Properties.getString('clientId'));
			}
		});
		dialog.show();
	}
};

exports.mirrorAll = function(_args) {
	console.log('Info: start mirroring');
	var mirrorFile = function(_file) {
		var filename = _file.name;
		var md5 = _file.md5;
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
		console.log('path: ' + file.nativePath);
		_args.onstart(filename);
		var xhr = Ti.Network.createHTTPClient({
			timeout : 60000,
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
		var url = Ti.App.Properties.getString('baseurl') + Ti.App.Properties.getString('datafolder', 'FINAL_DATA') + '/' + filename;
		xhr.open('GET', url, true);
		console.log(url);
		xhr.file = file, xhr.send(null);
	};
	if (Ti.Network.online == false) {
		alert('Das Gerät hat zur Zeit kein Internetzugang, daher ist ein Abgleich nicht möglich');
		return;
	}
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			console.log(this.responseText);
			try {
				var list = JSON.parse(this.responseText);
			} catch(E) {
				return;
			}
			// now removing of obsolete files:
			var localfiles = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).getDirectoryListing();
			for (var i = 0; i < localfiles.length; i++) {
				if (list.in_filearray(localfiles[i]) == false && Ti.App.Properties.getBool('no-cache') == true) {
					var todeletefilehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, localfiles[i]);
					todeletefilehandle.deleteFile();
					console.log('Info: ' + localfiles[i] + ' deleted!');
				}
			}
			var counter = list.length;
			for (var i = 0; i < counter; i++) {
				console.log('Info: file try to mirror: ' + list[i].name);
				var filehandle = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, list[i].name);
				if (filehandle.exists() && Ti.App.Properties.hasProperty(list[i].md5)) {
					counter--;
					console.log('Info: ' + list[i].name + ' is actual ' + counter);
					continue;
				}
				mirrorFile(list[i]);
			}
			if (counter == 0)
				alert('Dokumentation ist auf aktuellem Stande.');
		},
		onerror : function() {
			console.log(this.error);
		}
	});
	var url = Ti.App.Properties.getString('baseurl') + '.mirror.php';
	xhr.open('POST', url);
	xhr.send({
		path : Ti.App.Properties.getString('datafolder', 'FINAL_DATA')
	});
};
