exports.create = function(pdf) {
	var self = Ti.UI.createView({
		width : 140,
		top : 20,
		left : 20,
		url : pdf.url,
		height : 140,
		visible : false
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
	self.pb = Ti.UI.createProgressBar({
		bottom : 10,
		width : Ti.UI.FILL,
		height : 20,
		transform : Ti.UI.create2DMatrix({
			scale : 0.6
		}),
		min : 0,
		max : 1,
		value : 0.1,
		zIndex : 999,
	});
	self.title = Ti.UI.createLabel({
		height : 20,
		bottom : 0,
		bubbleParent : true,
		color : 'black',
		zIndex : 999,
		font : {
			fontSize : 12
		},
		text : 'Name der Lektion'
	});
	self.add(self.title);
	self.add(self.pb);
	require('module/pdf.model').getPdfDocument(pdf.url, self.pb, function(_pdf) {
		self.remove(self.preview);
		self.add(_pdf.preview);
		self.title.setText(_pdf.title);
	});
	return self;
};

