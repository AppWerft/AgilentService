exports.create = function() {
	var self = Ti.UI.createWindow();
	self.tv = Ti.UI.createTableView({});
	self.add(self.tv);
	return self;
}
