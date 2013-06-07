exports.get = function(_url, _callback) {
	
	var parts = _url.split('/');
	var pspdfkit = require('com.pspdfkit');
	var fileName = parts[parts.length-1];
	//Ti.Utils.md5HexDigest(_url);
	console.log(fileName);
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
	if (!f.exists()) {
		var xhr = Titanium.Network.createHTTPClient({
			onload : function() {
				_callback({
					pdfpath : f.nativePath,
					preview : pspdfkit.imageForDocument(f.nativePath, 0, 1)
				});
			},
			timeout : 55000
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
