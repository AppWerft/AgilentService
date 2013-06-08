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
				width : 480,
				height : 320
			});
			add(publisherView);
		});
	} catch(E) {
	}
	var rightButton = Ti.UI.createButton({
		title : 'Anrufen'
	});
	var self = Ti.UI.iPad.createPopover({
		width : 480,
		height : 320,
		title : 'Videokonferenz',
		rightNavButton : rightButton
	});
	self.show({
		view : _actionsbutton
	});
	rightButton.addEventListener('click', function(e) {
		alert("But green's the color of spring.");
	});
	if (publisherView) self.add(publisherView);
	return self;
}
