var CONFIG = {
	sessionId : Ti.App.Properties.getString('opentok_sessionId'),
	apiKey : Ti.App.Properties.getString('opentok_apiKey'),
	token : Ti.App.Properties.getString('opentok_token')
};
var self;
function log(txt) {
	self.monitor.add(Ti.UI.createLabel({
		text : txt + ' ' + self.session.connectionCount,
		height : 20,
		left : 10,
		top : 0
	}));
}

/* Docu */

//  https://github.com/opentok/opentok-titanium-mobile/blob/master/documentation/index.md

var OpenTok = function() {
	console.log('=======' + 'Start construktor')

	self = Ti.UI.createView({
		height : 'auto',
		width : 'auto'
	});
	console.log('=======' + 'View')

	self.session = Ti.App.OpenTok.createSession({
		sessionId : CONFIG.sessionId
	});
	console.log('=======' + self.session.sessionConnectionStatus);
	self.session.addEventListener("sessionConnected", sessionConnectedHandler);
	self.session.addEventListener("sessionDisconnected", sessionDisconnectedHandler);
	self.session.addEventListener("sessionFailed", sessionFailedHandler);
	self.session.addEventListener("streamCreated", streamCreatedHandler);
	self.session.connect(CONFIG.apiKey, CONFIG.token);

	self.onDevice = (Ti.Platform.architecture === 'arm');
	self.connectingSpinner = Ti.UI.createActivityIndicator({
		color : 'white',
		message : 'Connecting...',
		style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height : 100,
		width : 100,
		backgroundColor : 'black',
		borderRadius : 10
	});
	self.add(self.connectingSpinner);
	self.connectingSpinner.show();
	self.monitor = Ti.UI.createScrollView({
		bottom : 0,
		backgroundColor : 'white',
		height : 100,
		width : Ti.UI.FILL,
		layout : 'vertical',
		contentWidth : Ti.UI.FILL,
		contentHEight : Ti.UI.SIZE
	});
	self.add(self.monitor);
	return this;
}
/*moduleprivate functions: */
function sessionConnectedHandler(event) {
	log('connected');
	self.connectingSpinner.hide();
	self.remove(self.connectingSpinner);
	if (self.onDevice) {
		self.publisher = self.session.publish();
		self.publisherView = self.publisher.createView({
			width : 200,
			height : 200,
			zIndex : 99,
			top : 0,
			right : 0
		});
		self.add(self.publisherView);
	}
}

function sessionDisconnectedHandler(event) {
	log('disconnected');
	// Remove publisher, subscriber, and their labels
	if (self.publisherView)
		self.remove(self.publisherView);
	if (self.subscriberView)
		self.remove(self.subscriberView);
}

function streamCreatedHandler(event) {
	if (event.stream.connection.connectionId === self.session.connection.connectionId) {
		log('own stream');
		return;
	}
	log('other streamHandler');
	if (!self.subsriber)
		self.subscriber = self.session.subscribe(event.stream);
	self.subscriberView = self.subscriber.createView({
		width : 300,
		height : 300,
		top : 0,
		left : 0,
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
		if (self.subscriber) {
			self.subscriber.close();
			self.remove(self.subscriberView);
			//			self.subscriberView  = null;
		}
		if (self.publisher) {
			self.session.unpublish();
			self.remove(self.publisherView);
		}
		if (self.session.sessionConnectionStatus == 'connected')
			self.session.disconnect();
		//self.removeAllChildren();
		console.log('Finish killing');
	}
}
module.exports = OpenTok;
