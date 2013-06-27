var self;
exports.create = function(_actionsbutton) {
	var publisher, publisherView;
	var CONF = {
		sessionId : Ti.App.Properties.getString('opentok_sessionId'),
		apiKey : Ti.App.Properties.getString('opentok_apiKey'),
		token : Ti.App.Properties.getString('opentok_token')
	};
	try {
		self = Ti.UI.iPad.createPopover({
			width : 360,
			height : 540,
			title : 'Videokonferenz',
		});
	} catch(E) {
		self = Ti.UI.createView({
			width : 360,
			height : 540,
			title : 'Videokonferenz',
		});
	}
	var OpenTok = require("com.tokbox.ti.opentok");
	var session = OpenTok.createSession({
		sessionId : CONF.sessionId
	});
	//	session.environment = 'production';
	session.connect(CONF.apiKey, CONF.token);
	session.addEventListener("sessionConnected", function(event) {
		self.connectingSpinner.hide();
		self.remove(self.connectingSpinner);
		Ti.Media.vibrate();
		publisher = session.publish();
		publisherView = publisher.createView({
			width : 360,
			height : 540
		});
		self.add(self.publisherView);
	});

	self.connectingSpinner = Ti.UI.createActivityIndicator({
		color : 'white',
		message : 'Verbindungsaufbau …',
		style : Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
		height : 200,
		width : 200,
		backgroundColor : 'black',
		borderRadius : 10
	});
	self.add(self.connectingSpinner);
	self.connectingSpinner.show();
	self.show({
		view : _actionsbutton
	});
	/*if (publisherView)
	 self.add(publisherView);
	 else {
	 self.add(Ti.UI.createImageView({
	 image : '/assets/rainer.png',
	 height : Ti.UI.SIZE,
	 width : Ti.UI.SIZE,
	 }));
	 self.add(Ti.UI.createImageView({
	 image : '/assets/rainer2.png',
	 width : 100,
	 height : Ti.UI.SIZE,
	 bottom : 0,
	 right : 0,
	 borderrWidth : 2,
	 borderRadius : 5,
	 borderColor : 'silver'
	 }));
	 }*/
	return self;
}
