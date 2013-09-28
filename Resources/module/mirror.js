exports.all = function() {
	var progresses = [];
	var total = 0;
	var progressdisplay = Ti.UI.createWindow({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		borderRadius : 10,
		layout : 'vertical',
		borderColor : '#066',
		borderWidth : 3,
		backgroundColor : 'gray'
	});
	progressdisplay.open();
	require('module/pdf.model').mirrorAll({
		onstart : function(_name) {
			total++;
			progresses[_name] = Ti.UI.createProgressBar({
				height : 40,
				top : 5,
				bottom : 10,
				left : 10,
				right : 10,
				message : _name,
				min : 0,
				font : {
					fontSize : '11dp'
				},
				color : 'silver',
				textAlign : 'left',
				width : 300,
				max : 1,
				value : 0
			});
			progresses[_name].show();
			progressdisplay.add(progresses[_name]);
		},
		onprogress : function(_p) {
			if (progresses[_p.name]) {
				progresses[_p.name].value = _p.progress;
			}
		},
		onload : function(_name) {
			if (progresses[_name]) {
				progressdisplay.remove(progresses[_name]);
				delete progresses[_name];
				total--;
			}
			var i = 0;
			for (var key in progresses) {
				i++;
			}
			if (!i && !total) {
				progressdisplay.close();
			}
		}
	});
}
