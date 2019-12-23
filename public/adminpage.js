$(document).ready(function(){
	$("#start").click(function(e) {
		e.preventDefault();
		var username = $("#username").val();
	
		var password = $("#password").val();
	
	
		var params = {
	
			username: username,
	
			password: password
	
		};
		$.post("/adminLog", params, function(result) {
			
			if (result && result.success) {
				
				$("#status").text("Successfully logged in.");
				window.location.href = result.redirect;
	
			} else {
				console.log('not logged in...');
				$("#status").text("Error logging in.");
			}
	
		});
		
			
	
	});
	console.log('after the ajax call');
})


