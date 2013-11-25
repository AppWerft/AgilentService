(function() {
	Ti.App.OpenTok = require('com.tokbox.ti.opentok');
	Ti.App.PSPDFKIT = require('com.pspdfkit');
	Ti.App.PSPDFKIT.setLicenseKey(Ti.App.Properties.getString('pspdfkit_licencekey'));
	Ti.App.PSPDFKIT.setLogLevel(4);
	Ti.App.PSPDFKIT.setLanguageDictionary({
		"en" : {
			"Table Of Contents" : "Outline",
			"Go to %@" : "%@",
		},
		"de" : {
			"Grid" : "Übersicht"
		}
	});
	require('module/pdf.model').init();
	require('module/ui.main').create();
})();

//http://www.tokbox.com/forums/ios/does-the-titanium-module-work-with-sdk-version-3-t16381