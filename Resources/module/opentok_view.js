var CONFIG = {
	sessionId : Ti.App.Properties.getString('opentok_sessionId'),
	apiKey : Ti.App.Properties.getString('opentok_apiKey'),
	token : Ti.App.Properties.getString('opentok_token')
};
var self;

function HelloView() {
	// create object instance
	if (self) self=null;
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
	self.publisherLabel = Ti.UI.createLabel({
		top : 20,
		text : 'Publisher',
		color : 'white'
	});
	self.subscriberLabel = Ti.UI.createLabel({
		top : 20,
		text : 'Subscriber',
		color : 'white'
	});

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

	return self;
}

function sessionConnectedHandler(event) {
	// Dismiss spinner
	self.connectingSpinner.hide();
	self.remove(self.connectingSpinner);
	self.layout = 'vertical';

	// Start publishing from my camera
	if (self.onDevice) {
		self.publisher = self.session.publish();
		self.publisherView = self.publisher.createView({
			width : 200,
			height : 150,
			top : 20
		});
		self.add(self.publisherLabel);
		self.add(self.publisherView);
	}
}

function sessionDisconnectedHandler(event) {
	// Remove publisher, subscriber, and their labels
	self.remove(self.publisherLabel);
	self.remove(self.publisherView);
	self.remove(self.subscriberLabel);
	self.remove(self.subscriberView);
}

function streamCreatedHandler(event) {
	if (event.stream.connection.connectionId === self.session.connection.connectionId) {
		return;
	}
	self.subscriber = self.session.subscribe(event.stream);
	self.subscriberView = self.subscriber.createView({
		width : 320,
		height : 240,
		top : 20
	});
	self.add(self.subscriberView);
}

function sessionFailedHandler(event) {
	Ti.API.info(event.error.message);
}

module.exports = HelloView;
