$(function()	{
	chrome.storage.sync.get("email",function(synced_data)	{
		$("#email_field").val(synced_data.email);
	});
	
	$("#authorize").click(function()	{
		var email = $("#email_field").val();
		
		if(email)	{
			chrome.identity.getAuthToken({'interactive': true}, function(token) {
				
  				$.ajax("https://sheets.googleapis.com/v4/spreadsheets/",
  					{	type:'POST',
  						headers:{"Authorization":"Bearer "+token
  							 },
  						error: function(xhr, status, error) {
							 console.log(xhr.responseText);
						},
  						success: function(data)	{
  							console.log(data);
  						}
  					});
			});
			chrome.storage.sync.set({"email":email},function()	{
				var notifOptions = {
					type:'basic',
					iconUrl:'icon.png',
					title:'Save to Sheet',
					message:'Authorised. Link of Google Sheets is available in Popup'
				};
				chrome.notifications.create('configNotif',notifOptions,function()	{
					//gapi.load('client:auth2', initialise);
				});
			});
		}
	});
	
	$("#clear").click(function()	{
		//chrome.identity.removeCachedAuthToken();
		
		chrome.storage.sync.remove("email",function()	{
			$("#email_field").val('');
			
			var notifOptions = {
					type:'basic',
					iconUrl:'icon.png',
					title:'Save to Sheet',
					message:'Settings of Save to Sheet Extension cleared.'
				};
				chrome.notifications.create('configNotif',notifOptions,function()	{
					//close();
				});
		});
	});
});
