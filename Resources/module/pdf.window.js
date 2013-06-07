exports.create = function(url) {
	var window = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	window.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
	var pspdfkit = require('com.pspdfkit');
	pspdfkit.setLogLevel(3);
	pspdfkit.setLanguageDictionary({
		"en" : {
			// general
			"Table Of Contents" : "Outline",
			"Go to %@" : "%@",
		},
		"de" : {
			"Grid" : "Übersicht"
		}
	});
	
	
	var pdfView = pspdfkit.createView({
		top :0,
		right : 0,
		bottom : 0,
		left : 0,
		filename : 'PSPDFKit.pdf',
		options : {
			pageMode : 1,
			toolbarEnabled : false,
		},
		documentOptions : {
			title : "Mein Titel"
		}
	});

	pdfView.setAnnotationSaveMode(1);
	pdfView.thumbnailFilterOptions = null;
	window.add(pdfView);
/*
	webDownloadTestButton.addEventListener('click', function(e) {
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
		if (!f.exists()) {
			var xhr = Titanium.Network.createHTTPClient({
				onload : function() {
					Ti.API.info('PDF downloaded to appDataDirectory/' + fileName);
					Ti.App.fireEvent('test_pdf_downloaded', {
						filePath : f.nativePath
					});
				},
				timeout : 15000
			});
			xhr.open('GET', 'http://www.enough.de/fileadmin/uploads/dev_guide_pdfs/Guide_11thEdition_WEB-1.pdf');
			xhr.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
			xhr.send();
		} else {
			Ti.App.fireEvent('test_pdf_downloaded', {
				filePath : f.nativePath
			});
		}
	});
*/
	Ti.App.addEventListener('test_pdf_downloaded', function(e) {
		pspdfkit.showPDFAnimated(e.filePath);
	});
	return window;
}
