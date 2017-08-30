var unique = 0, set = {}, courses = [];

// there's a lot of weird math but basically color is based on 3 factors
// 1) Primarily, the first 3 characters of the course code is grouped into similar hues
// 2) Secondarily, the last 2 characters slightly alter the hue (depending on how many courses are in the same group)
// 3) The light value (kind like value and brightness together) is based on the 4th character (which year) of the course
function getColor(course){
	if(course == '--------<br>-')
		return 'lightgray';

	var head = course.slice(0, 3);
	var tail = course.slice(4, 6);
	var hue = set[head].index / unique * 360 + (set[head].tails[tail]  / set[head].count) * (360 / unique);
	if('1234567890'.indexOf(course[3]) != -1)
		var light = 100 - course[3] / 4 * 50 + '%';
	else
		var light = 90 - (course.charCodeAt(3) - 65) / 6 * 45 + '%';
	var sat = '80%';
	return 'hsl(' + hue + ', ' + sat + ', ' + light + ')';
}

// border color based on class code
function getBorderColor(course){
	var classNum = course.slice(11, 13);
	print(classNum);
	return 'hsl(' + classNum / 10 * 360 + ', 100%, 50%)';
}

function color(){
	items = $('tbody > tr > td');
	for(var i = 0; i < items.length; i++){
		if(i % 10 > 1 ){
			$(items[i]).css('background-color', getColor(items[i].innerHTML));
			if(items[i].innerHTML == '--------<br>-'){
				$(items[i]).css('color', 'lightgray');
				$(items[i]).css('user-select', 'none');
			}
		}
	}

	$('#loading').hide();
	$('#main').show();
}

function buildTable(){
	var name = $('#dropdown').val(), match;
	print(name);

	for(var i = 0; i < courses.length; i++)
		if(courses[i][0] == name)
			match = courses[i];

	var course, person, head, tail, row, classNum, table = $('tbody');

	table.empty();

	for(var i = 0; i < courses.length; i++){
		person = courses[i];

		if(person[0] == name)
			continue;

		row = '<tr>';
		row += '<td>' + person[0] + '</td>';
		row += '<td style="background-color: hsl(0, 0%, ' + ( 90 - (person[1] - 9) * 15) + '%);">' + person[1] + '</td>';

		for(var j = 2; j < 10; j++){
			course = person[j];
			head = course.slice(0, 3);
			tail = course.slice(4, 6);

			//some really weird data structure for hue calculation
			if(set[head] === undefined){
				set[head] = {
					index: unique++,
					count: 1,
					tails: {}
				};
				set[head].tails[tail] = 0;
			}
			else{
				if(set[head].tails[tail] === undefined)
					set[head].tails[tail] = set[head].count++;
			}

			if(course == match[j])
				row += '<td>' + course + '</td>';
			else
				row += '<td>--------<br/>-</td>';
		}

		row += '</tr>';
		print(row);
		table.append(row);
	}

	//after courses have been counted, color the table
	color();
	$('table').trigger("update");
}

function addDots(){
	for(var i = 0; i < courses.length; i++){
		for(var j = 2; j < 10; j++){
			if(courses[i][j].slice(-2) == 0)
				courses[i][j] = courses[i][j].slice(0, -2) + '<br/>-';
			else
				courses[i][j] = courses[i][j].slice(0, -2) + '<br/>' + '•'.repeat(courses[i][j].slice(-2));
		}
	}
}

function dropdown(data){
	var person, name;

	courses = data;

	for(var i = 0; i < courses.length; i++){
		person = courses[i];
		name = person[0];
		$('select').append('<option value="' + name + '">' + name + '</option>');
	}

	addDots();
}

$(document).ready(function(){
	topbar();
	getData(dropdown);
	$('table').tablesorter();

	$('#dropdown').change(function(){
		buildTable();
	});
});
