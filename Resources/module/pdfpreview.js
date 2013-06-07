exports.create = function(pdf) {
	var self = Ti.UI.createView({
		width : 150,
		top : 10,
		left : 10,
		url : pdf.url,
		height : 150
	});
	self.preview = Ti.UI.createImageView({
		width : 130,
		top : 0,
		height : 130,
		bubbleParent : true,
		borderRadius : 8,
		parent : self,
		image : 'appicon.png'
	})
	self.add(self.preview);
	self.add(Ti.UI.createLabel({
		height : 20,
		bottom : 0,
		bubbleParent : true,
		color : 'yellow',
		zIndex : 999,
		font : {
			fontSize : 12
		},
		text : pdf.title
	}));
	require('module/pdf.model').get(pdf.url, function(_pdf) {
		self.remove(self.preview);
		self.add(_pdf.preview);
	});
	return self;
}
