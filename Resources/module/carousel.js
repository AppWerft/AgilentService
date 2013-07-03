exports.create = function(_args) {
	try {var TiCarousel = require('com.obscure.ticarousel');
	var views = [];
//	views.push(require('module/masterview').create());
	views.push(Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'black',
		opacity : 0.7
	}));
	views.push(Ti.UI.createView({
		backgroundColor : 'blue',
		opacity : 0.7
	}));
	var self = TiCarousel.createCarouselView({
		top : 40,
		left : 40,
		right : 40,
		bottom : 40,
		borderRadius : 10,
		borderColor : 'gray',
		borderWidth : 1,
		carouselType : TiCarousel.CAROUSEL_TYPE_WHEEL,
		views : views,
		numberOfVisibleItems : 12,
		wrap : true,
	});

	return self;} catch(E) {console.log(E);}
}
