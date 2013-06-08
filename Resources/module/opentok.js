exports.create = function(_actionsbutton) {
	var rightButton = Ti.UI.createButton({
		title : 'Anrufen'
	});
	var self= Ti.UI.iPad.createPopover({
		width : 480,
		height : 320,
		title : 'Videokonferenz',
		rightNavButton : rightButton
	});
	self.show({
		view : _actionsbutton
	});
	var view = Ti.UI.createView({
		backgroundColor : 'white'
	});

	rightButton.addEventListener('click', function(e) {
		alert("But green's the color of spring.");
	});
	self.add(view);
	return self;
}
