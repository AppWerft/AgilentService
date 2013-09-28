exports.create = function(url) {
	var window = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	window.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
	

	var pdfView = Ti.App.PSPDFKIT.createView({
		top : 0,
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
		Ti.App.PSPDFKIT.showPDFAnimated(e.filePath, 4, {
			lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
			pageMode : 0, // PSPDFPageModeSingle
			pageTransition : 2, // PSPDFPageCurlTransition
			linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
			thumbnailSize : [200, 200], // Allows custom thumbnail size.

			// toolbar config: see http://pspdfkit.com/documentation/Classes/PSPDFViewController.html#//api/name/outlineButtonItem for built in options.
			// Built in options are send via string. Invalid strings will simply be ignored.
			leftBarButtonItems : ["closeButtonItem"],
			//	rightBarButtonItems : [navButton, "viewModeButtonItem"],

			// note that the "annotationButtonItem" is not available in PSPDFKit Basic (the marketplace.appcelerator.com version)
			// to get text selection and annotation feature, purchase a full license of PSPDFKit Annotate at http://PSPDFKit.com
			additionalBarButtonItems : ["openInButtonItem", "emailButtonItem", "printButtonItem", "searchButtonItem", "outlineButtonItem", "annotationButtonItem"] // text list, does *not* support custom buttons.
			// pageMode values 0=single page, 1=double page, 2=automatic
			// some supported properties
			// see http://pspdfkit.com/documentation/Classes/PSPDFViewController.html
			/* doublePageModeOnFirstPage: true,
			 * page" : 3,
			 * pageScrolling" : 1,
			 * zoomingSmallDocumentsEnabled : false,
			 * fitToWidthEnabled : false,
			 * maximumZoomScale : 1.3,
			 * pagePadding : 80,
			 * shadowEnabled : false,
			 * backgroundColor : "#FF0000", */
		}, {
			title : "Titel der Lektion",
		});
	});
	return window;
};
