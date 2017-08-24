var unique = 0, set = {};

// there's a lot of weird math but basically color is based on 3 factors
// 1) Primarily, the first 3 characters of the course code is grouped into similar hues
// 2) Secondarily, the last 2 characters slightly alter the hue (depending on how many courses are in the same group)
// 3) The light value (kind like value and brightness together) is based on the 4th character (which year) of the course
function getColor(course){
	var head = course.slice(0, 3);
	var tail = course.slice(4, 6);
	var hue = set[head].index / unique * 360 + (set[head].tails[tail]  / set[head].count) * (360 / unique);
	if('1234567890'.indexOf(course[3]) != -1)
		var light = 90 - course[3] / 4 * 45 + '%';
	else
		var light = 90 - (course.charCodeAt(3) - 65) / 6 * 45 + '%';
	var sat = '100%';
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
		}
	}

	$('#loading').hide();
	$('table').show();
}

function buildTable(courses){
	//Add the dots
	for(var i = 0; i < courses.length; i++)
		for(var j = 2; j < 10; j++)
			courses[i][j] = courses[i][j].slice(0, -2) + '<br/>' + '•'.repeat(courses[i][j].slice(-2));

	var course, person, head, tail, row, classNum, table = $('tbody');
	for(var i = 0; i < courses.length; i++){
		person = courses[i];
		row = '<tr>';
		for(var j = 0; j < 10; j++){
			course = person[j];

			if(j == 0){ //name field
				row += '<td style="background-color:hsl(60, 100%, 80%)">' + course + '</td>';
			}
			else if(j == 1){ //grade field
				row += '<td style="background-color: hsl(0, 0%, ' + ( 90 - (courses[i][j] - 9) * 15) + '%);">' + course + '</td>';
			}
			else{ //if it's not a name or grade field
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
				row += '<td>' + course + '</td>';
			}
		}
		row += '</tr>';
		table.append(row);
	}

	//after courses have been counted, color the table
	color();
}

$(document).ready(function(){
	getData(buildTable);
});
