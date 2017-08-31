var LOCAL;

function print(){
	if(LOCAL)
		for(var i = 0; i < arguments.length; i++)
			console.log(arguments[i]);	
}

function getData(callback){
	var courses = [];
	$.get('/global/global.php', function(data){
		if(data == ''){ //if there is no data return empty array and abort
			callback([]);
			return;
		}

		courses = data;
		courses = data.trim().split('\n');
		for(var i = 0; i < courses.length; i++){
			courses[i] = courses[i].slice(0, -1).split(';');
		}

		//Sort by name
		courses.sort(function(a, b){
			if(a[0] < b[0])
				return -1;
			else if(a[0] > b[0])
				return 1;
			return 0;
		});

		callback(courses);
	});
}

function topbar(){
	$.get('/global/topbar.html', function(data){
		$('body').prepend(data);
		$('body').show();
	});
}

$(document).ready(function(){
	if(window.location.origin == 'http://localhost:8000'){
		$('title').html('Local');
		LOCAL = true;
	}
	else
		$('title').html('Mac Timetables');
});
