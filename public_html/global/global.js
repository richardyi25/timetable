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
			for(var j = 1; j < 9; j++)
				courses[i][j] = courses[i][j].slice(0, -2) + '<br/>' + '•'.repeat(courses[i][j].slice(-2));// + '<br/>(' + courses[i][j].slice(-2) + ')';
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
