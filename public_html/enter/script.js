//TODO: errortrap fully
var name, courses, email, error, warning;

function displayKey(key){
	$('#displayKey').show();
	$('#key').text(key);
	var info = "Please keep this key safe. As soon as I get around to adding that feature, your key will allow you to edit your courses in case you change them or realize you submitted the wrong one.";
	if(key == "ERROR: INVALID INPUT")
		info = "If this occurred during regular use of this site, please <a>contact me</a>";
	$('#displayKey').append("<br/>" + info);
}

function ajax(){
	var courseText = "";

	$('#info, #input, #confirm').hide();

	for(var i = 0; i < 8; i++)
		courseText += courses[i] + ';';
	if(email == '')
		email = 'none';

	$.get('/enter/script.php', {
			name: name,
			courses: courseText,
			email: email
		},
		function(data){
			displayKey(data);
		}
	);
}

function checkCourses(){
	courses = [];
	var error = [], warning = [];
	var input = $('#input > .inputCourse .inputField');

	for(var i = 0; i < input.length; i++){
		if(input[i].value == '')
			courses.push('-');
		else
			courses.push(input[i].value.toUpperCase());
	}

	//error-trapping
	for(var i = 0; i < courses.length; i++){
		if(courses[i].includes(';')){
			error.push(courses[i]);
		}
	}

	//warning-trapping
	for(var i = 0; i < courses.length; i++){
		for(var j = 0; j < courses[i].length; j++){
			if('1234567890QWERTYUIOPASDFGHJKLZXCVBNM-'.indexOf(courses[i][j]) == -1){
				warning.push(courses[i]);
				break;
			}
		}
	}

	if(error.length > 0){
		var message = "Error: The following courses are invalid:\n";

		for(var i = 0; i < error.length; i++)
			message += error[i] + '\n';

		if(warning.length > 1){
			message += "\nAdditionally, the following courses contain non-standard characters:\n";
			for(var i = 0; i < error.length; i++)
				message += warning[i] + '\n';
		}

		alert(message);
		return false;
	}

	//if there are warnings but no errors
	else if(warning.length > 0){
		var message = "", answer;

		message += "Warning: the following courses contain non-standard characters:\n";
		for(var i = 0; i < warning.length; i++)
			message += warning[i] + '\n';
		message += "\nContinue anyways?";

		answer = confirm(message);

		return answer;
	}

	return true;
}

function checkEmail(){
	if($('#emailField').val() != $('#confirmEmail').val()){
		alert("Your emails do not match.");
		return false;
	}
	else if($('#emailField').val().includes(';')){
		alert("Your email contains illegal characters.");
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
	$('button[name="confirm"]').click(function(){
		// abusing short-circut mechanics
		// only calls the next function if the one before returns true
		if(checkName() && checkCourses() && checkEmail())
			ajax();
	});
});
