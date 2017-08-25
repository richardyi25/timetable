//TODO: errortrap fully
var name, courses = [], email, error, warning;

function displayKey(key){
	$('#displayKey').show();
	$('#key').text(key);
	var info = "Please keep this key safe. As soon as I get around to adding that feature, your key will allow you to edit your courses in case you change them or realize you submitted the wrong one.";
	if(key == "ERROR: INVALID INPUT")
		info = "If this occurred during regular use of this site, please <a>contact me</a>";
	$('#displayKey').append("<br/>" + info);
}

function ajax(){
	var courseText = "", grade = $('.inputGrade > select').val();

	$('#info, #input, #confirm').hide();

	for(var i = 0; i < 8; i++)
		courseText += courses[i] + ';';
	if(email == '')
		email = 'none';

	$.get('/enter/script.php', {
			grade: grade,
			name: name,
			courses: courseText,
			email: email
		},
		function(data){
			displayKey(data);
		}
	);
}

function okay(course){
	if(course == 'SPARE')
		return true;

	//Condition 1: Must be 8 characters long
	if(course.length != 8)
		return false;

	//Condition 2: Must be alphanumeric
	for(var i = 0; i < course.length; i++)
		if('1234567890QWERTYUIOPASDFGHJKLZXCVBNM'.indexOf(course[i]) == -1)
			return false;

	//Condition 3: 4th character must be a number unless it's an ESL or LWS course, in which case it must be A to F
	if(course.slice(0, 3) == 'ESL' || course.slice(0, 3) == 'LWS'){
		if('ABCDEF'.indexOf(course[3]) == -1)
			return false;
	}
	else{
		if('1234567890'.indexOf(course[3]) == -1)
			return false;
	}

	//Condition 4: Class code must be 01 to 09
	return Number.parseInt(course.slice(6)) < 10;
}

function checkCourses(){
	var allOkay = true;
	courses = [];
	var input = $('#input > .inputCourse .inputField');

	//Reset
	$('#confirm2').hide();
	$('#warning').text('');

	for(var i = 0; i < 8; i++){
		//Reset
		$(input[i]).css('border', '');
		if(input[i].value == '')
			courses[i] = 'SPARE';
		else
			courses[i] = input[i].value.toUpperCase();
	}

	for(var i = 0; i < 8; i++){
		if(!okay(courses[i])){
			$(input[i]).css('border-color', 'red');
			allOkay = false;
		}
	}

	if(!allOkay){
		$('#warning').text('One or more courses doesn\'t follow regular course code rules. Are you sure you want to submit?');
		$('#confirm2').show();
	}

	return allOkay;
}

function checkEmail(){
	if($('#emailField').val() != $('#confirmEmail').val()){
		alert("Your emails do not match!");
		return false;
	}
	else if($('#emailField').val().includes(';')){
		alert("Your email contains illegal characters!");
		return false;
	}
	else{
		email = $('#emailField').val();
		return true;
	}
}

function checkName(){
	name = $('.inputName > input').val();
	if(name == ''){
		alert("You cannot have no name!");
		return false;
	}
	else if(name.includes(';')){
		alert("Your name contains illegal characters!");
		return false;
	}

	return true;
}

$(document).ready(function(){
	topbar();

	$('button[name="confirm"]').click(function(){
		// abusing short-circut mechanics
		// only calls the next function if the one before returns true
		if(checkName() && checkEmail() && checkCourses())
			ajax();
	});

	$('button[name="confirm2"]').click(function(){
		if(checkName() && checkEmail())
			ajax();
	});

	$('button[name="unconfirm"]').click(function(){
		$('#confirm2').hide();
	});
});
