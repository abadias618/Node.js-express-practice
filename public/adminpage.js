function login() {

	var username = $("#username").val();

	var password = $("#password").val();



	var params = {

		username: username,

		password: password

	};

	console.log('executed params and about to enter ajax');
	$.post('/adminLog', params, function(result) {

		console.log('inside ajax');	
		if (result && result.success == true) {

			//$("#status").text("Successfully logged in.");
			console.log('logged in in ajax');
			window.location.href = result.redirect;

		} else {

			//$("#status").text("Error logging in.");
			console.log('not logged in in ajax');
			window.location.href = result.redirect;
		}

	});
	

}

