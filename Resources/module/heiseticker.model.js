exports.get = function(_args) {
	var self = Ti.Network.createHTTPClient({
		onload : function() {
			var items = require('ti.xml2json').convert(this.responseText).rss.channel.item;
			_args.onload(items);
		}
	});
	self.open('GET',_args.url);
	self.send(null);
}
