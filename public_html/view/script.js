var unique = 0;
var set = {};

// there's a lot of weird math but basically color is based on 3 factors
// 1) Primarily, the first 3 characters of the course code is grouped into similar hues
// 2) Secondarily, the last 2 characters slightly alter the hue (depending on how many courses are in the same group)
// 3) The light value (kind like value and brightness together) is based on the 4th character (which year) of the course
function getColor(course){
	var head = course.slice(0, 3);
	var tail = course.slice(4, 6);
	var hue = set[head].index / unique * 360 + (set[head].tails[tail]  / set[head].count) * (360 / unique);
	var light = 90 - course[3] / 4 * 45 + '%';
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
		if(i % 9 != 0){
			$(items[i]).css('background-color', getColor(items[i].innerHTML));
			//$(items[i]).css('border-color', getBorderColor(items[i].innerHTML));
			//$(items[i]).append('<div class="dot" style="color:' + getBorderColor(items[i].innerHTML) + ';">.</div>');
			//TODO: fix
		}
	}

	$('#loading').hide();
	$('table').show();
}

function buildTable(courses){
	var course, person, head, tail, row, classNum, table = $('tbody');
	for(var i = 0; i < courses.length; i++){
		person = courses[i];
		row = '<tr>';
		for(var j = 0; j < 9; j++){
			course = person[j];
			head = course.slice(0, 3);
			tail = course.slice(4, 6);

			if(j > 0){ //if it's not a name field
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
			}
			row += '<td>' + course + '</td>';
		}
		row += '</tr>';
		table.append(row);
	}

	color();
}

$(document).ready(function(){
	getData(buildTable);
});
