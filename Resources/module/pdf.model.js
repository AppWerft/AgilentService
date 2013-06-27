exports.get = function(_url, _pb, _callback) {
	var parts = _url.split('/');
	var pspdfkit = require('com.pspdfkit');
	var fileName = parts[parts.length - 1];
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
	_pb.show();
	if (f.exists()) {
		try {
			pspdfkit.imageForDocument(f.nativePath, 0, 1);
			_callback({
				pdfpath : f.nativePath,
				preview : pspdfkit.imageForDocument(f.nativePath, 0, 1)
			});
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
						pdfpath : f.nativePath,
						preview : pspdfkit.imageForDocument(f.nativePath, 0, 1)
					});
				}
			},
			timeout : 60000
		});
		xhr.open('GET', _url);
		xhr.file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
		xhr.send(null);
	}
}

exports.getlist = function(_callback) {
	var url = Ti.App.Properties.getString('lectionsurl');
	console.log(url);
	var xhr = Titanium.Network.createHTTPClient({
		onload : function() {
			_callback(JSON.parse(this.responseText));
		},
		timeout : 120000
	});
	xhr.open('GET', url);
	xhr.send(null);
};

