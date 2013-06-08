exports.create = function(pdf) {
	var self = Ti.UI.createView({
		width : 140,
		top : 20,
		left : 20,
		url : pdf.url,
		height : 140
	});
	self.preview = Ti.UI.createImageView({
		width : 100,
		top : 0,
		height : 100,
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
