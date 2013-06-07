exports.get = function(_url, _callback) {
	var parts = _url.split('/');
	var pspdfkit = require('com.pspdfkit');
	var fileName = parts[parts.length - 1];
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
	if (!f.exists()) { 
		var xhr = Titanium.Network.createHTTPClient({
			onload : function() {
				_callback({
					pdfpath : f.nativePath,
					preview : pspdfkit.imageForDocument(f.nativePath, 0, 1)
				});
			},
			timeout : 60000
		});
		xhr.open('GET', _url);
		xhr.file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
		xhr.send();
	} else {
		_callback({
			pdfpath : f.nativePath,
			preview : pspdfkit.imageForDocument(f.nativePath, 0, 1)
		});
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

