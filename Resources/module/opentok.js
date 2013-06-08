exports.create = function(_actionsbutton) {
	var publisher, publisherView;
	try {
		var OpenTok = require("com.tokbox.ti.opentok");
		var session = OpenTok.createSession({
			sessionId : Ti.App.Properties.getString('sessionId')
		});
		session.connect(Ti.App.Properties.getString('apiKey'), Ti.App.Properties.getString('token'));
		session.addEventListener("sessionConnected", function(event) {
			publisher = session.publish();
			publisherView = publisher.createView({
				width : 360,
				height : 540
			});
			add(publisherView);
		});
	} catch(E) {
	}
	var rightButton = Ti.UI.createButton({
		title : 'Anrufen'
	});
	var self = Ti.UI.iPad.createPopover({
		width : 360,
		height : 540,
		title : 'Videokonferenz',
		rightNavButton : rightButton
	});
	self.show({
		view : _actionsbutton
	});
	rightButton.addEventListener('click', function(e) {
		alert("But green's the color of spring.");
	});
	if (publisherView)
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
	}
	return self;
}
