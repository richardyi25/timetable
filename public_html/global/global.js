var DEBUG = true;

function print(){
	if(DEBUG)
		for(var i = 0; i < arguments.length; i++)
			console.log(arguments[i]);	
}

function getData(callback){
	var courses = [];
	$.get('/global/global.php', function(data){
		if(data == '') //if there is no data, abort
			return;

		courses = data;
		courses = data.trim().split('\n');
		for(var i = 0; i < courses.length; i++){
			courses[i] = courses[i].slice(0, -1).split(';');
		}
		callback(courses);
	});
}

$(document).ready(function(){
	//TODO: AJAX to topbar.html
	if(window.location.origin == 'http://localhost:8000')
		$('title').html('Local');
	else
		$('title').html('Live');
});
