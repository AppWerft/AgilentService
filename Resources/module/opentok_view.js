var CONFIG = {
	sessionId : Ti.App.Properties.getString('opentok_sessionId'),
	apiKey : Ti.App.Properties.getString('opentok_apiKey'),
	token : Ti.App.Properties.getString('opentok_token')
};
var self;

/* Docu */

//  https://github.com/opentok/opentok-titanium-mobile/blob/master/documentation/index.md

var OpenTok = function() {

	self = Ti.UI.createView({
		height : 'auto',
		width : 'auto'
	});
	self.opentok = require('com.tokbox.ti.opentok');
	self.session = self.opentok.createSession({
		sessionId : CONFIG.sessionId
	});
	self.session.environment = 'production';
	self.session.addEventListener("sessionConnected", sessionConnectedHandler);
	self.session.addEventListener("sessionDisconnected", sessionDisconnectedHandler);
	self.session.addEventListener("sessionFailed", sessionFailedHandler);
	self.session.addEventListener("streamCreated", streamCreatedHandler);
	self.session.connect(CONFIG.apiKey, CONFIG.token);

	// publishing only works from device: let's find out where we are
	self.onDevice = (Ti.Platform.architecture === 'arm');

	// create labels

	// show connecting modal
	self.connectingSpinner = Ti.UI.createActivityIndicator({
		color : 'white',
		message : 'Connecting...',
		style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height : 200,
		width : 200,
		backgroundColor : 'black',
		borderRadius : 10
	});
	self.add(self.connectingSpinner);
	self.connectingSpinner.show();
	return this;
}
/*moduleprivate functions: */
function sessionConnectedHandler(event) {
	// Dismiss spinner
	self.connectingSpinner.hide();
	self.remove(self.connectingSpinner);
	self.layout = 'vertical';

	// Start publishing from my camera
	if (self.onDevice) {
		self.publisher = self.session.publish();
		self.publisherView = self.publisher.createView({
			width : 100,
			height : 80,
			zIndex : 99,
			bottom : 0,
			right : 0
		});

		self.add(self.publisherView);
	}
}

function sessionDisconnectedHandler(event) {
	// Remove publisher, subscriber, and their labels
	if (self.publisherView)
		self.remove(self.publisherView);
	if (self.subscriberView)
		self.remove(self.subscriberView);
}

function streamCreatedHandler(event) {
	if (event.stream.connection.connectionId === self.session.connection.connectionId) {
		return;
	}
	self.subscriber = self.session.subscribe(event.stream);
	self.subscriberView = self.subscriber.createView({
		width : 'auto',
		height : 'auto',
		top : 0,
		zIndex : 1
	});
	self.add(self.subscriberView);
}

function sessionFailedHandler(event) {
	Ti.API.info(event.error.message);
}

/*public methods: */

OpenTok.prototype.getView = function() {
	return self;
}
OpenTok.prototype.finishSession = function() {
	if (self.session) {
		//self.session.unpublish();
		self.session.disconnect();
		//self.removeAllChildren();
		console.log('Finish killing');
	}
}
module.exports = OpenTok;
